import { toast } from "react-toastify";
import { getRemoteItem, setRemoteItem } from "./firebaseStorage";

export const REMOTE_LIST_ID_KEY = "lista-remota";
const TOAST_DEDUPE_WINDOW_MS = 10_000;

export type RemoteLoadResult = "unlinked" | "loaded" | "created" | "error";

function readLocal(key: string): unknown {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function getRemoteListId(): string | null {
  const listId = readLocal(REMOTE_LIST_ID_KEY);
  return typeof listId === "string" && listId.trim() ? listId : null;
}

type SyncStatus = "success" | "error";
let lastSyncStatus: { status: SyncStatus; at: number } | null = null;

/**
 * Só mostra o toast quando o status muda, ou quando passaram 10s sem nenhum
 * resultado igual. Dez sucessos seguidos mostram só o primeiro; um erro no
 * meio deles aparece normalmente (e o sucesso seguinte também).
 */
function notifySyncStatus(status: SyncStatus, message: string) {
  const now = Date.now();
  const isRepeat =
    lastSyncStatus?.status === status &&
    now - lastSyncStatus.at < TOAST_DEDUPE_WINDOW_MS;
  lastSyncStatus = { status, at: now };
  if (isRepeat) return;
  if (status === "success") toast.success(message);
  else toast.error(message);
}

type PendingWrite = { listId: string; key: string; value: unknown };
const pendingWrites = new Map<string, PendingWrite>();
const activeQueues = new Set<string>();

/**
 * Agenda a gravação de `key` na lista remota vinculada (se houver uma).
 * Gravações da mesma chave saem uma de cada vez e sempre com o valor mais
 * recente, para que uma resposta antiga não sobrescreva a lista nova.
 */
export function saveRemote(key: string, value: unknown) {
  const listId = getRemoteListId();
  if (!listId) return;
  const queueId = JSON.stringify([listId, key]);
  pendingWrites.set(queueId, { listId, key, value });
  if (!activeQueues.has(queueId)) void drainQueue(queueId);
}

async function drainQueue(queueId: string) {
  activeQueues.add(queueId);
  // Junta as gravações feitas no mesmo ciclo (ex.: editar = remover + adicionar).
  await Promise.resolve();
  try {
    let write: PendingWrite | undefined;
    while ((write = pendingWrites.get(queueId))) {
      pendingWrites.delete(queueId);
      try {
        await setRemoteItem(write.listId, write.key, write.value);
        notifySyncStatus("success", "Lista atualizada!");
      } catch (error) {
        console.error("Erro ao salvar lista remota:", error);
        notifySyncStatus("error", "Erro ao atualizar lista remota");
      }
    }
  } finally {
    activeQueues.delete(queueId);
  }
}

/**
 * Busca `key` na lista remota vinculada. Se existir, entrega para
 * `applyRemote`; se ainda não existir, publica o que há localmente para que
 * quem abrir a lista em outro aparelho já veja os dados.
 */
export async function syncFromRemote<T>(
  key: string,
  applyRemote: (value: T) => void
): Promise<RemoteLoadResult> {
  const listId = getRemoteListId();
  if (!listId) return "unlinked";
  try {
    const remoteValue = await getRemoteItem<T>(listId, key);
    if (remoteValue !== null) {
      applyRemote(remoteValue);
      return "loaded";
    }
    const localValue = readLocal(key);
    if (localValue) saveRemote(key, localValue);
    return "created";
  } catch (error) {
    console.error("Erro ao carregar lista remota:", error);
    notifySyncStatus("error", "Erro ao carregar lista remota");
    return "error";
  }
}

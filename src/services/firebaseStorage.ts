/**
 * Cliente mínimo da API REST do Firebase Realtime Database.
 * https://firebase.google.com/docs/reference/rest/database
 *
 * Os dados ficam em /listas/{nomeDaLista}/{chave}. Cada valor é gravado como
 * uma string JSON porque o Realtime Database descarta arrays vazios e campos
 * null, o que quebraria estruturas como `recipes: []`.
 */

const DATABASE_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.replace(
  /\/+$/,
  ""
);
const REQUEST_TIMEOUT_MS = 10_000;

export class RemoteStorageError extends Error {
  name = "RemoteStorageError";
}

// O Firebase não aceita ". # $ [ ] /" em chaves. O encodeURIComponent troca
// todos menos o "." (tratado à parte) por "%XX", e "%" é permitido. A segunda
// codificação é a da URL, que o Firebase decodifica uma vez.
function toPathSegment(value: string) {
  const firebaseKey = encodeURIComponent(value.trim()).replace(/\./g, "%2E");
  return encodeURIComponent(firebaseKey);
}

async function request(
  method: "GET" | "PUT",
  listId: string,
  key: string,
  body?: string
) {
  if (!DATABASE_URL) {
    throw new RemoteStorageError(
      "Defina NEXT_PUBLIC_FIREBASE_DATABASE_URL no .env.local"
    );
  }
  const query = method === "PUT" ? "?print=silent" : "";
  const url = `${DATABASE_URL}/listas/${toPathSegment(listId)}/${toPathSegment(
    key
  )}.json${query}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method,
      body,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new RemoteStorageError(
        `${method} "${key}" falhou com HTTP ${response.status}`
      );
    }
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getRemoteItem<T>(
  listId: string,
  key: string
): Promise<T | null> {
  const response = await request("GET", listId, key);
  const stored: unknown = await response.json();
  if (stored === null) return null;
  return (typeof stored === "string" ? JSON.parse(stored) : stored) as T;
}

export async function setRemoteItem(
  listId: string,
  key: string,
  value: unknown
): Promise<void> {
  await request("PUT", listId, key, JSON.stringify(JSON.stringify(value)));
}

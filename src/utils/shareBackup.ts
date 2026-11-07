export type ShareResult = "shared" | "downloaded" | "cancelled";

const SHARE_TITLE = "Backup da lista de compras";

/**
 * Abre o menu de compartilhar do aparelho (WhatsApp, e-mail, Drive...) com um
 * arquivo de backup. Sem suporte ao compartilhamento (ex.: desktop), baixa o
 * arquivo.
 */
export async function shareBackup(data: unknown): Promise<ShareResult> {
  const date = new Date().toISOString().slice(0, 10);
  const json = JSON.stringify(data, null, 2);
  // .txt/text/plain porque o Chrome do Android não compartilha arquivos .json
  const file = new File([json], `backup-lista-de-compras-${date}.txt`, {
    type: "text/plain",
  });

  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: SHARE_TITLE });
      return "shared";
    }
    if (navigator.share) {
      await navigator.share({ title: SHARE_TITLE, text: json });
      return "shared";
    }
  } catch (error) {
    if ((error as Error).name === "AbortError") return "cancelled";
    console.error("Falha ao compartilhar, baixando o arquivo:", error);
  }

  downloadFile(file);
  return "downloaded";
}

function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

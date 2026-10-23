import axios from "axios";

/**
 * Devolve a mensagem de erro enviada pela API ({ error: "..." }) quando existir.
 * Qualquer outro erro (rede, 500 sem corpo etc.) usa a mensagem padrão recebida.
 */
export default function getErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;

  const data: unknown = error.response?.data;

  if (typeof data !== "object" || data === null) return fallback;
  if (!("error" in data)) return fallback;
  if (typeof data.error !== "string") return fallback;

  return data.error;
}

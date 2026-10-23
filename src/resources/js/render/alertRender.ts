export type AlertVariant = "success" | "danger" | "warning" | "info";

/** Troca o conteúdo do container por um alerta do Bootstrap com a mensagem. */
export default function alertRender(container: HTMLElement, message: string, variant: AlertVariant): void {
  const alertElement = document.createElement("div");
  alertElement.classList.add("alert", `alert-${variant}`, "mb-0");
  alertElement.setAttribute("role", "alert");
  alertElement.textContent = message;

  container.replaceChildren(alertElement);
}

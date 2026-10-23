import type { PaginatedResponse, User } from "../types/api";
import alertRender from "./alertRender";

function userLocation(user: User): string {
  return [user.city, user.state].filter(Boolean).join("/") || "—";
}

function userRender(user: User, onChoose: (user: User) => void): HTMLLIElement {
  const liElement = document.createElement("li");
  liElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "gap-3");

  const infoElement = document.createElement("div");

  const nameElement = document.createElement("div");
  nameElement.classList.add("fw-semibold");
  nameElement.textContent = user.name;

  const detailsElement = document.createElement("small");
  detailsElement.classList.add("text-muted");
  detailsElement.textContent = `${user.email} · ${user.job_title ?? "—"} · ${userLocation(user)}`;

  infoElement.append(nameElement, detailsElement);

  const chooseButton = document.createElement("button");
  chooseButton.type = "button";
  chooseButton.classList.add("btn", "btn-outline-primary", "btn-sm");
  chooseButton.textContent = "Escolher";
  chooseButton.addEventListener("click", () => onChoose(user));

  liElement.append(infoElement, chooseButton);

  return liElement;
}

/** Mostra o total encontrado e a lista de usuários, cada um com o botão "Escolher". */
export default function userSearchResultsRender(
  container: HTMLElement,
  result: PaginatedResponse<User>,
  onChoose: (user: User) => void
): void {
  if (result.data.length === 0) {
    alertRender(container, "Nenhum usuário encontrado para essa busca.", "info");
    return;
  }

  const totalElement = document.createElement("p");
  totalElement.classList.add("small", "text-muted", "mb-2");
  totalElement.textContent = `${result.total} usuário(s) encontrado(s)`;

  if (result.total > result.data.length) {
    totalElement.textContent += ` — mostrando os ${result.data.length} primeiros. Refine a busca para ver outros.`;
  }

  const ulElement = document.createElement("ul");
  ulElement.classList.add("list-group");
  ulElement.append(...result.data.map((user) => userRender(user, onChoose)));

  container.replaceChildren(totalElement, ulElement);
}

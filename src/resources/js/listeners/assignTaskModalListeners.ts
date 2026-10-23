import { userSearchApi } from "../api/userSearchApi";
import { taskCreateApi } from "../api/taskCreateApi";
import alertRender from "../render/alertRender";
import tasksListRender from "../render/tasksListRender";
import userSearchResultsRender from "../render/userSearchResultsRender";
import getErrorMessage from "../utils/getErrorMessage";
import type { User, UserSearchFilters, UserSearchTextField } from "../types/api";

const SEARCH_FIELDS: readonly string[] = ["name", "email", "job_title", "bio", "city", "state"];
const FEEDBACK_TIMEOUT_MS = 5000;

function isSearchField(value: string): value is UserSearchTextField {
  return SEARCH_FIELDS.includes(value);
}

export default function assignTaskModalListeners(idUser: number): void {
  const modal = document.querySelector<HTMLElement>("#assign-task-modal");
  const taskNameInput = document.querySelector<HTMLInputElement>("#assign-task-name");
  const searchFieldSelect = document.querySelector<HTMLSelectElement>("#assign-search-field");
  const searchValueInput = document.querySelector<HTMLInputElement>("#assign-search-value");
  const searchButton = document.querySelector<HTMLButtonElement>("#assign-search-btn");
  const resultsContainer = document.querySelector<HTMLElement>("#assign-search-results");
  const selectedUserElement = document.querySelector<HTMLElement>("#assign-selected-user");
  const submitButton = document.querySelector<HTMLButtonElement>("#assign-task-submit");
  const modalMessage = document.querySelector<HTMLElement>("#assign-task-message");
  const pageFeedback = document.querySelector<HTMLElement>("#assign-task-feedback");

  if (
    !modal ||
    !taskNameInput ||
    !searchFieldSelect ||
    !searchValueInput ||
    !searchButton ||
    !resultsContainer ||
    !selectedUserElement ||
    !submitButton ||
    !modalMessage ||
    !pageFeedback
  ) {
    return;
  }

  let selectedUser: User | null = null;
  let feedbackTimer: number | undefined;

  function showSelectedUser(): void {
    if (!selectedUserElement) return;

    if (!selectedUser) {
      selectedUserElement.textContent = "Nenhum usuário escolhido.";
      return;
    }

    selectedUserElement.textContent = `Atribuir para: ${selectedUser.name} (${selectedUser.email})`;
  }

  function resetModal(): void {
    selectedUser = null;

    if (taskNameInput) taskNameInput.value = "";
    if (searchValueInput) searchValueInput.value = "";
    if (searchFieldSelect) searchFieldSelect.selectedIndex = 0;
    resultsContainer?.replaceChildren();
    modalMessage?.replaceChildren();
    showSelectedUser();
  }

  function showPageFeedback(message: string, variant: "success" | "danger"): void {
    if (!pageFeedback) return;

    alertRender(pageFeedback, message, variant);

    window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => pageFeedback.replaceChildren(), FEEDBACK_TIMEOUT_MS);
  }

  function closeModal(): void {
    // O botão Cancelar tem data-bs-dismiss="modal": clicar nele fecha o modal pelo Bootstrap.
    modal?.querySelector<HTMLButtonElement>('[data-bs-dismiss="modal"]')?.click();
  }

  function chooseUser(user: User): void {
    selectedUser = user;
    modalMessage?.replaceChildren();
    showSelectedUser();
  }

  async function searchHandler(): Promise<void> {
    if (!searchFieldSelect || !searchValueInput || !searchButton || !resultsContainer) return;

    const field = searchFieldSelect.value;
    const text = searchValueInput.value.trim();

    if (!text) {
      alertRender(resultsContainer, "Digite um texto para buscar.", "warning");
      return;
    }

    if (!isSearchField(field)) {
      alertRender(resultsContainer, "Campo de busca inválido.", "danger");
      return;
    }

    const filters: UserSearchFilters = {};
    filters[field] = text;

    searchButton.disabled = true;
    alertRender(resultsContainer, "Buscando...", "info");

    try {
      const result = await userSearchApi(filters, 1, 10);
      userSearchResultsRender(resultsContainer, result, chooseUser);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alertRender(resultsContainer, getErrorMessage(error, "Erro ao buscar usuários. Tente novamente."), "danger");
    } finally {
      searchButton.disabled = false;
    }
  }

  async function submitHandler(): Promise<void> {
    if (!taskNameInput || !submitButton || !modalMessage) return;

    const name = taskNameInput.value.trim();

    if (!name) {
      alertRender(modalMessage, "Digite o nome da tarefa.", "warning");
      return;
    }

    if (!selectedUser) {
      alertRender(modalMessage, "Busque e escolha um usuário para receber a tarefa.", "warning");
      return;
    }

    const targetUser = selectedUser;
    submitButton.disabled = true;

    try {
      await taskCreateApi(targetUser.id, { name });
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alertRender(modalMessage, getErrorMessage(error, "Erro ao criar tarefa. Tente novamente."), "danger");
      return;
    } finally {
      submitButton.disabled = false;
    }

    resetModal();
    closeModal();
    showPageFeedback(`Tarefa "${name}" criada para ${targetUser.name}.`, "success");

    if (targetUser.id !== idUser) return;

    try {
      await tasksListRender(idUser);
    } catch (error) {
      console.error("Erro ao recarregar a lista:", error);
      showPageFeedback("Tarefa criada, mas não foi possível atualizar a lista. Recarregue a página.", "danger");
    }
  }

  searchButton.addEventListener("click", searchHandler);
  searchValueInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    void searchHandler();
  });
  submitButton.addEventListener("click", submitHandler);
  modal.addEventListener("hidden.bs.modal", resetModal);

  showSelectedUser();
}

/**
 * This file handles the actions in the app. And it is also resposible for the user's interaction with the app.
 */

import {
  nextPage,
  previousPage,
  getCurrentPageTransactions,
  goToPage,
  displaySortBox,
  searchTransactions,
  sortTransactions,
  searchRecurringTransactions,
  sortBills,
  displayCategoryBox,
  categorizeTransactions,
  handleThemeSelection,
  createNewPot,
  addSavingsAmount,
  confirmAddSavingsAmount,
  withdrawSavingsAmount,
  confirmWithdrawSavingsAmount,
  editPotThemeSelection,
  editPot,
  deletePot,
} from "./main.js";
import {
  renderPaginationBtns,
  renderRecurringBills,
  renderTransactions,
} from "./render.js";

const currentPath = window.location.pathname;

const appContainer = document.querySelector("#app-container");

const handleClickEvent = (event) => {
  const previousButton = event.target.closest("#prev-btn");
  const nextButton = event.target.closest("#next-btn");
  const liNumber = event.target.closest("li[data-page]");
  const sortBtn = event.target.closest("button.sort-btn, i.sort-btn");
  const categoryBtn = event.target.closest(
    "button.category-btn, i.category-btn",
  );
  const sortDropdownItems = event.target.closest("a[data-sort]");
  const categoryDropdownItems = event.target.closest("a[data-categorize]");
  const potDropdownBtn = event.target.closest(".dropdown-btn");
  const openNewPotModalBtn = event.target.closest("#new-pot-btn");
  const closeNewPotModalBtn = event.target.closest("#close-new-pot-modal-btn");
  const themeDropdownBtn = event.target.closest(".theme-dropdown-btn");
  const themeBtn = event.target.closest("a[data-theme]");
  const addNewPotBtn = event.target.closest(".add-new-pot-btn");
  const openAddMoneyModal = event.target.closest(".add-money-btn");
  const closeAddMoneyModal = event.target.closest("#close-add-money-modal-btn");
  const confirmAddMoneyBtn = event.target.closest(".confirm-add-money-btn");
  const openWithdrawMoneyModal = event.target.closest(".withdraw-money-btn");
  const closeWithdrawMoneyModal = event.target.closest(
    ".close-withdraw-money-modal-btn",
  );
  const confirmWithdrawMoneyBtn = event.target.closest(
    ".confirm-withdraw-money-btn",
  );
  const openEditModal = event.target.closest(".open-edit-modal");
  const closeEditModal = event.target.closest(".close-edit-modal-btn");
  const editPotThemeDropdownBtn = event.target.closest(
    ".pot-theme-dropdown-btn",
  );
  const editedPotThemeBtn = event.target.closest("a[data-pottheme]");
  const confirmEditPotBtn = event.target.closest(".edit-pot-btn");
  const openDeleteModal = event.target.closest(".open-delete-modal");
  const closeDeleteModal = event.target.closest(
    ".close-delete-savings-modal-btn",
  );
  const cancelDeleteSavingsPot = event.target.closest(
    ".reject-delete-savings-btn",
  );
  const confirmDeleteSavingsPot = event.target.closest(
    ".confirm-delete-savings-btn",
  );

  if (liNumber) {
    const id = Number(liNumber.dataset.page);
    const paginationContainer = event.target.closest(
      ".desktop-pagination,.mobile-pagination",
    );
    const btnPage = paginationContainer.querySelectorAll(".page-btn");
    // This is the 0-based index fix as the index is starting from 0 instead of 1
    const index = id - 1;
    const activeButton = btnPage.item(index);

    // Strips the buttons of it's style whenever it is clicked
    btnPage.forEach((btn) => {
      if (btn) {
        btn.classList.remove("bg-gray-900", "text-white");
      }
    });

    // Styles the newly clicked button :)
    if (activeButton) {
      activeButton.classList.add("bg-gray-900", "text-white");
    }

    goToPage(id);

    const transactions = getCurrentPageTransactions();

    renderTransactions(transactions);
  }

  if (previousButton) {
    previousPage(event);

    const transactions = getCurrentPageTransactions();

    renderTransactions(transactions);
  }

  if (nextButton) {
    nextPage(event);

    const transactions = getCurrentPageTransactions();

    renderTransactions(transactions);
  }

  if (sortBtn) {
    if (currentPath.includes("transactions.html")) {
      const id = Number(sortBtn.dataset.btn);

      if (id === 1) {
        displaySortBox(event);
      }
    }

    if (currentPath.includes("recurring_bills.html")) {
      const id = Number(sortBtn.dataset.btn);

      if (id === 1) {
        displaySortBox(event);
      }
    }
  }

  if (sortDropdownItems) {
    if (currentPath.includes("transactions.html")) {
      const sortType = event.target.dataset.sort;
      const sortedTransactions = sortTransactions(sortType);

      const page = 1;

      goToPage(page);

      renderTransactions(sortedTransactions);
      renderPaginationBtns(sortedTransactions);

      console.log(sortedTransactions);
    }

    if (currentPath.includes("recurring_bills.html")) {
      const sortType = event.target.dataset.sort;
      const sortedBills = sortBills(sortType);

      renderRecurringBills(sortedBills);
    }
  }

  if (categoryBtn) {
    if (currentPath.includes("transactions.html")) {
      const id = Number(categoryBtn.dataset.btn);

      console.log(id);

      if (id === 2) {
        displayCategoryBox(event);
      }
    }
  }

  if (categoryDropdownItems) {
    if (currentPath.includes("transactions.html")) {
      const category = event.target.dataset.categorize;
      const categorizedTransactions = categorizeTransactions(category);

      const page = 1;

      goToPage(page);

      renderTransactions(categorizedTransactions);
      renderPaginationBtns(categorizedTransactions);
    }
  }

  if (potDropdownBtn) {
    const pot = potDropdownBtn.closest(".pot");
    const potDropdown = pot.querySelector(".pot-dropdown");

    potDropdown.classList.toggle("hidden");
  }

  if (openNewPotModalBtn) {
    const newPotModal = document.querySelector(".new-pot-modal");
    newPotModal.classList.remove("hidden");
    newPotModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  if (closeNewPotModalBtn) {
    const newPotModal = document.querySelector(".new-pot-modal");
    newPotModal.classList.remove("flex");
    newPotModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (themeDropdownBtn) {
    const themeDropdown = document.querySelector(".theme-dropdown");
    themeDropdown.classList.toggle("hidden");
  }

  if (themeBtn) {
    handleThemeSelection(themeBtn);
  }

  if (addNewPotBtn) {
    let index = 5;
    index++;
    createNewPot(index);
    const newPotModal = document.querySelector(".new-pot-modal");
    newPotModal.classList.remove("flex");
    newPotModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (openAddMoneyModal) {
    const addBtn = openAddMoneyModal.closest(".pot");
    const addMoneyModal = addBtn.querySelector(".add-money-modal");

    addMoneyModal.classList.remove("hidden");
    addMoneyModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  if (closeAddMoneyModal) {
    const closeBtn = closeAddMoneyModal.closest(".pot");
    const addMoneyModal = closeBtn.querySelector(".add-money-modal");

    addMoneyModal.classList.remove("flex");
    addMoneyModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (confirmAddMoneyBtn) {
    confirmAddSavingsAmount(event);
    const closeBtn = confirmAddMoneyBtn.closest(".pot");
    const addMoneyModal = closeBtn.querySelector(".add-money-modal");

    addMoneyModal.classList.remove("flex");
    addMoneyModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (openWithdrawMoneyModal) {
    const withdrawBtn = openWithdrawMoneyModal.closest(".pot");
    const withdrawMoneyModal = withdrawBtn.querySelector(
      ".withdraw-money-modal",
    );

    withdrawMoneyModal.classList.remove("hidden");
    withdrawMoneyModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  if (closeWithdrawMoneyModal) {
    const closeWithdrawBtn = closeWithdrawMoneyModal.closest(".pot");
    const withdrawMoneyModal = closeWithdrawBtn.querySelector(
      ".withdraw-money-modal",
    );

    withdrawMoneyModal.classList.remove("flex");
    withdrawMoneyModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (confirmWithdrawMoneyBtn) {
    confirmWithdrawSavingsAmount(event);
    const closeBtn = confirmWithdrawMoneyBtn.closest(".pot");
    const withdrawMoneyModal = closeBtn.querySelector(".withdraw-money-modal");

    withdrawMoneyModal.classList.remove("flex");
    withdrawMoneyModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (openEditModal) {
    const currentPot = openEditModal.closest(".pot");
    const editModal = currentPot.querySelector(".edit-pot-modal");

    editModal.classList.add("flex");
    editModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  if (closeEditModal) {
    const currentPot = closeEditModal.closest(".pot");
    const editModal = currentPot.querySelector(".edit-pot-modal");

    editModal.classList.remove("flex");
    editModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (editPotThemeDropdownBtn) {
    const pot = editPotThemeDropdownBtn.closest(".pot");
    const editPotThemeDropdown = pot.querySelector(".pot-theme-dropdown");
    editPotThemeDropdown.classList.toggle("hidden");
  }

  if (editedPotThemeBtn) {
    editPotThemeSelection(editedPotThemeBtn);
  }

  if (confirmEditPotBtn) {
    editPot(event);
    document.body.classList.remove("overflow-hidden");
  }

  if (openDeleteModal) {
    const currentPot = openDeleteModal.closest(".pot");
    const deleteModal = currentPot.querySelector(".delete-savings-modal");

    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  if (closeDeleteModal) {
    const currentPot = closeDeleteModal.closest(".pot");
    const deleteModal = currentPot.querySelector(".delete-savings-modal");

    deleteModal.classList.remove("flex");
    deleteModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (cancelDeleteSavingsPot) {
    const currentPot = cancelDeleteSavingsPot.closest(".pot");
    const deleteModal = currentPot.querySelector(".delete-savings-modal");

    deleteModal.classList.remove("flex");
    deleteModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (confirmDeleteSavingsPot) {
    deletePot(event);
    const currentPot = confirmDeleteSavingsPot.closest(".pot");
    const deleteModal = currentPot.querySelector(".delete-savings-modal");

    deleteModal.classList.remove("flex");
    deleteModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }
};

const handleKeyDownEvent = (event) => {
  const key = event.key;

  if (currentPath.includes("transactions.html")) {
    // ArrowRight key goes to next page
    if (key === "ArrowRight") {
      nextPage(event);

      const transactions = getCurrentPageTransactions();

      renderTransactions(transactions);
    }

    // ArrowLeft key goes to previous page
    if (key === "ArrowLeft") {
      previousPage(event);

      const transactions = getCurrentPageTransactions();
      renderTransactions(transactions);
    }
  }
};

const handleInputEvent = (event) => {
  if (currentPath.includes("transactions.html")) {
    const transactions = searchTransactions(event);

    const page = 1;

    goToPage(page);

    renderTransactions(transactions);
  }

  if (currentPath.includes("recurring_bills.html")) {
    const recurringBills = searchRecurringTransactions(event);

    renderRecurringBills(recurringBills);
  }

  if (currentPath.includes("pots.html")) {
    const savingsAmountInput = event.target.closest(".savings-target-input");
    const withdrawAmountInput = event.target.closest(".withdraw-target-input");

    if (savingsAmountInput) {
      addSavingsAmount(event);
    }

    if (withdrawAmountInput) {
      withdrawSavingsAmount(event);
    }
  }
};

appContainer.addEventListener("click", handleClickEvent);
appContainer.addEventListener("keydown", handleKeyDownEvent);
appContainer.addEventListener("input", handleInputEvent);

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
};

const handleKeyDownEvent = (event) => {
  const key = event.key;

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
};

appContainer.addEventListener("click", handleClickEvent);
appContainer.addEventListener("keydown", handleKeyDownEvent);
appContainer.addEventListener("input", handleInputEvent);

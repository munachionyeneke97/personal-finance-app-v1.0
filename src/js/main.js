/**
 * This file is responsible for the fetching of data from the data.json file and this is where the app's logic is handled.
 */
import {
  renderTransactions,
  renderRecurringBills,
  renderPaginationBtns,
  renderPotsPage,
  renderNewPotForm,
  renderAddMoneyPreview,
  renderAddMoney,
  renderWithdrawMoneyPreview,
  renderWithdrawMoney,
} from "./render.js";

const currentPath = window.location.pathname;

// VARIABLES
// This variable is the single source of truth for the transactions & recurring bills page.
let transactions = [];
// This variable is the single source of truth for the pots page.
let pots = [];
let selectedPotTheme;
let editedPotTheme;
// This variable is the single source of truth for the budgets page.
let budgets = [];
// This variable updates the data that is being rendered in the UI in the transactions page.
export let displayedTransactions = [];
// This variable updates the data that is being rendered in the UI in the recurring bills page.
let displayedBills = [];
// This is the derived dataset from our transactions arr that can be mutated for the sorting,category and pagination features.
let currentFilteredData = [];
// These variables are used in the pagination function to know the current page and to specify how many transactions we want per page.
const transactionsPerPage = 10;
export let currentPage = 1;

// This is the function that fetches data from our data.json file as we have no database yet.
export async function getData() {
  const response = await fetch("../src/data/data.json");
  const data = await response.json();

  transactions = data.transactions;
  pots = data.pots;
  budgets = data.budgets;

  displayedTransactions = [...transactions];
  currentFilteredData = [...transactions];

  return (transactions, pots, budgets);
}

await getData();

console.log(pots, budgets);

export function getCurrentPageTransactions() {
  const startIndex = (currentPage - 1) * transactionsPerPage;

  const endIndex = startIndex + transactionsPerPage;

  return displayedTransactions.slice(startIndex, endIndex);
}

export function createNewTransaction() {}

export function getRecurringTransactions() {
  const bills = transactions.filter((bill) => bill.recurring);

  return bills;
}

export function calculateTotalTransactions() {
  const totalAmount = transactions.map((bill) => {
    return { amount: bill.amount };
  });
  const sum = totalAmount.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount;
  }, 0);
  console.log(sum);
}

export function calculateTotalBills() {
  const recurring = getRecurringTransactions();
  const totalAmount = recurring.map((bill) => {
    return { amount: bill.amount };
  });
  const sum = totalAmount.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount;
  }, 0);
  return sum;
}

if (currentPath.includes("transactions.html")) {
  renderTransactions(displayedTransactions);
}

if (currentPath.includes("recurring_bills.html")) {
  renderRecurringBills(getRecurringTransactions());
}

if (currentPath.includes("pots.html")) {
  renderPotsPage(pots);
  renderNewPotForm();
}

export function nextPage(event) {
  const totalPages = Math.ceil(
    displayedTransactions.length / transactionsPerPage,
  );

  if (currentPage < totalPages) {
    currentPage++;

    // This is the 0-based index fix as the index is starting from 0 instead of 1
    const index = currentPage - 1;
    const paginationContainer = event.target.closest(
      ".desktop-pagination, .mobile-pagination",
    );
    const btnPage = paginationContainer.querySelectorAll(".page-btn");

    // Safety Check: This prevents going past the last available page button
    if (index >= btnPage.length) {
      console.log("Already on the last page!");
      return;
    }

    // Strips the buttons of it's style whenever it is clicked
    btnPage.forEach((btn) => {
      if (btn) btn.classList.remove("bg-gray-900", "text-white");
    });

    // Styles the newly clicked button :)
    const activeButton = btnPage.item(index);
    if (activeButton) {
      activeButton.classList.add("bg-gray-900", "text-white");
    }
  }
}

export function previousPage(event) {
  if (currentPage > 1) {
    currentPage--;

    // This is the 0-based index fix as the index is starting from 0 instead of 1
    const index = currentPage - 1;
    const paginationContainer = event.target.closest(
      ".desktop-pagination,.mobile-pagination",
    );
    const btnPage = paginationContainer.querySelectorAll(".page-btn");

    // Safety Check: This prevents going past the last available page button
    if (index >= btnPage.length) {
      console.log("Already on the last page!");
      return;
    }

    // Strips the buttons of it's style whenever it is clicked
    btnPage.forEach((btn) => {
      if (btn) btn.classList.remove("bg-gray-900", "text-white");
    });

    // Styles the newly clicked button :)
    const activeButton = btnPage.item(index);
    if (activeButton) {
      activeButton.classList.add("bg-gray-900", "text-white");
    }
  }
}

export function goToPage(page) {
  currentPage = page;

  // return currentPage;
}

export function displaySortBox(event) {
  if (currentPath.includes("transactions.html")) {
    const sortContainer = event.target.closest(".desktop-sort,.mobile-sort");
    const sortBox = sortContainer.querySelector(".sort-dropdown");

    sortBox.classList.toggle("hidden");
  }

  if (currentPath.includes("recurring_bills.html")) {
    const sortContainer = event.target.closest(".desktop-sort,.mobile-sort");
    const sortBox = sortContainer.querySelector(".sort-dropdown");

    sortBox.classList.toggle("hidden");
  }
}

export function displayCategoryBox(event) {
  if (currentPath.includes("transactions.html")) {
    const categoryContainer = event.target.closest(
      ".desktop-sort,.mobile-sort",
    );
    const categoryBox = categoryContainer.querySelector(".category-dropdown");

    categoryBox.classList.toggle("hidden");
  }
}

export function handleThemeSelection(themeBtn) {
  const selectedTheme = themeBtn.dataset.theme;
  const themes = {
    Teal: "bg-[#277C78]",
    Charcoal: "bg-[#626070]",
    Turquoise: "bg-[#82C9D7]",
    Peach: "bg-[#F2CDAC]",
    Violet: "bg-[#826CB0]",
  };
  console.log(selectedTheme);
  const themePreview = document.querySelector(".theme-preview");
  const themeName = document.querySelector(".theme-name");

  themePreview.classList.remove("bg-[#277C78]");
  themePreview.classList.add(`${themes[selectedTheme]}`);
  themeName.textContent = selectedTheme;

  const activeTheme = themes[selectedTheme];

  selectedPotTheme = activeTheme;

  return activeTheme;
}

export function editPotThemeSelection(editedPotThemeBtn) {
  const selectedTheme = editedPotThemeBtn.dataset.pottheme;
  const editPotThemes = {
    Teal: "bg-[#277C78]",
    Charcoal: "bg-[#626070]",
    Turquoise: "bg-[#82C9D7]",
    Peach: "bg-[#F2CDAC]",
    Violet: "bg-[#826CB0]",
  };

  const pot = editedPotThemeBtn.closest(".pot");

  const themePreview = pot.querySelector(".pot-theme-preview");
  const themeName = pot.querySelector(".pot-theme-name");

  themePreview.classList.remove("bg-[#277c78]");
  themePreview.classList.add(`${editPotThemes[selectedTheme]}`);
  themeName.textContent = selectedTheme;

  const activeTheme = editPotThemes[selectedTheme];

  editedPotTheme = activeTheme;

  return activeTheme;
}

export function editPot(event) {
  if (currentPath.includes("pots.html")) {
    const potElement = event.target.closest(".pot");
    const targetInput = potElement.querySelector("#edit-target-input");
    const potNameInput = potElement.querySelector("#edit-name-input");
    const target = Number(targetInput.value);

    const potId = potElement.dataset.id;

    const updatedPotsArray = pots.map((pot) => {
      if (pot.id === potId) {
        // Mutate the object that matches the id
        pots[pot] = {
          id: pot.id,
          name: potNameInput.value,
          target: target,
          total: pot.total,
          theme: editedPotTheme,
        };

        // Replace with the updated object
        const updatedPot = pots[pot];
        return updatedPot;
      }
      // Keep all other pots exactly as they are
      return pot;
    });

    renderPotsPage(updatedPotsArray);

    potNameInput.value = "";
    targetInput.value = "";
  }
}

export function deletePot(event) {
  if (currentPath.includes("pots.html")) {
    const potElement = event.target.closest(".pot");
    const potId = potElement.dataset.id;

    const updatedPotsArray = pots.filter((pot) => {
      return pot.id !== potId;
    });

    console.log(updatedPotsArray);
    renderPotsPage(updatedPotsArray);
  }
}

export function createNewPot(index) {
  if (currentPath.includes("pots.html")) {
    const targetInput = document.querySelector("#target-input");
    const potNameInput = document.querySelector("#name-input");

    let newPot = {
      id: "pot-" + index,
      name: potNameInput.value,
      target: targetInput.value,
      total: 0,
      theme: selectedPotTheme,
    };
    pots = [...pots, newPot];
    renderPotsPage(pots);

    potNameInput.value = "";
    targetInput.value = "";
  }
}

export function addSavingsAmount(event) {
  const savingsAmountInput = event.target.closest(".savings-target-input");
  const potElement = savingsAmountInput.closest(".pot");
  const potId = potElement.dataset.id;
  const pot = pots.find((pot) => pot.id === potId);
  const amount = Number(savingsAmountInput.value);

  const newTotal = pot.total + amount;
  const newProgress = ((newTotal / pot.target) * 100).toFixed(2);

  renderAddMoneyPreview(event, newTotal, newProgress);
}

export function confirmAddSavingsAmount(event) {
  const confirmAddition = event.target.closest(".confirm-add-money-btn");
  const potElement = confirmAddition.closest(".pot");
  const savingsAmountInput = potElement.querySelector(".savings-target-input");
  const potId = potElement.dataset.id;
  const pot = pots.find((pot) => pot.id === potId);
  const amount = Number(savingsAmountInput.value);

  const newTotal = pot.total + amount;
  const newProgress = ((newTotal / pot.target) * 100).toFixed(2);

  pot.total += amount;

  console.log(pot.total);

  renderAddMoney(event, newTotal, newProgress);
  savingsAmountInput.value = "";
}

export function withdrawSavingsAmount(event) {
  const withdrawAmountInput = event.target.closest(".withdraw-target-input");
  const potElement = withdrawAmountInput.closest(".pot");
  const potId = potElement.dataset.id;
  const pot = pots.find((pot) => pot.id === potId);
  const amount = Number(withdrawAmountInput.value);

  const newTotal = pot.total - amount;
  const newProgress = ((newTotal / pot.target) * 100).toFixed(2);

  renderWithdrawMoneyPreview(event, newTotal, newProgress);
}

export function confirmWithdrawSavingsAmount(event) {
  const confirmWithdrawal = event.target.closest(".confirm-withdraw-money-btn");
  const potElement = confirmWithdrawal.closest(".pot");
  const withdrawAmountInput = potElement.querySelector(
    ".withdraw-target-input",
  );
  const potId = potElement.dataset.id;
  const pot = pots.find((pot) => pot.id === potId);
  const amount = Number(withdrawAmountInput.value);

  const newTotal = pot.total - amount;
  const newProgress = ((newTotal / pot.target) * 100).toFixed(2);

  pot.total -= amount;

  console.log(pot.total);

  renderWithdrawMoney(event, newTotal, newProgress);
}

export function searchTransactions(event) {
  const searchTerm = event.target.value.toLowerCase();

  if (searchTerm === "") {
    displayedTransactions = [...currentFilteredData];
  } else {
    const filteredTransactions = currentFilteredData.filter((transaction) => {
      return transaction.name.toLowerCase().includes(searchTerm);
    });

    displayedTransactions = filteredTransactions;
  }

  const page = 1;

  goToPage(page);

  renderPaginationBtns();
  return displayedTransactions;
}

export function searchRecurringTransactions(event) {
  const recurring = [...getRecurringTransactions()];
  const searchTerm = event.target.value.toLowerCase();

  const filteredBills = recurring.filter((bill) => {
    return bill.name.toLowerCase().includes(searchTerm);
  });

  return filteredBills;
}

export function getFilteredTransactions() {
  return currentFilteredData;
}

export function sortTransactions(sortType) {
  const sortedTransactions = [...currentFilteredData];

  if (sortType === "highest") {
    sortedTransactions.sort((a, b) => b.amount - a.amount);
  }

  if (sortType === "lowest") {
    sortedTransactions.sort((a, b) => a.amount - b.amount);
  }

  if (sortType === "a-z") {
    sortedTransactions.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
  if (sortType === "z-a") {
    sortedTransactions.sort((a, b) => b.name.localeCompare(a.name));
  }
  if (sortType === "oldest") {
    sortedTransactions.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  }
  if (sortType === "latest") {
    sortedTransactions.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }

  displayedTransactions = sortedTransactions;

  console.log(displayedTransactions);

  return displayedTransactions;
}

export function sortBills(sortType) {
  const sortedBills = [...getRecurringTransactions()];

  if (sortType === "highest") {
    sortedBills.sort((a, b) => a.amount - b.amount);
  }

  if (sortType === "lowest") {
    sortedBills.sort((a, b) => b.amount - a.amount);
  }

  if (sortType === "a-z") {
    sortedBills.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
  if (sortType === "z-a") {
    sortedBills.sort((a, b) => b.name.localeCompare(a.name));
  }
  if (sortType === "oldest") {
    sortedBills.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  }
  if (sortType === "latest") {
    sortedBills.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }

  displayedBills = sortedBills;

  return displayedBills;
}

export function categorizeTransactions(category) {
  const initialTransactions = [...currentFilteredData];

  if (category === "all transactions") {
    displayedTransactions = initialTransactions;
  } else {
    const categorizedTransactions = initialTransactions.filter(
      (transaction) => {
        return transaction.category.toLowerCase() === category.toLowerCase();
      },
    );

    displayedTransactions = categorizedTransactions;
  }

  console.log(displayedTransactions);

  return displayedTransactions;
}

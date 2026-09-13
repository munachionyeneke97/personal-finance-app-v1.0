/**
 * This file is responsible for the fetching of data from the data.json file and this is where the app's logic is handled.
 */
import {
  renderTransactions,
  renderRecurringBills,
  renderPaginationBtns,
} from "./render.js";

const currentPath = window.location.pathname;

// VARIABLES
let transactions = [];
export let displayedTransactions = [];
let displayedBills = [];
let currentFilteredData = [];
const transactionsPerPage = 10;
export let currentPage = 1;

export async function getData() {
  const response = await fetch("./data/data.json");
  const data = await response.json();

  transactions = data.transactions;

  displayedTransactions = [...transactions];
  currentFilteredData = [...transactions];

  return transactions;
}

await getData();

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
    console.log(paginationContainer);
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

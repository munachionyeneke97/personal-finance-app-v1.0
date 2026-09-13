/* THIS FILE IS RESPONSIBLE FOR BUILDING THE UI BY RENDERING DATA IN THE WHOLE APPLICATION. IT IS USED TO RENDER THE DATA IN THE DOM.
 */
import {
  getCurrentPageTransactions,
  calculateTotalBills,
  goToPage,
  displayedTransactions,
  currentPage,
} from "./main.js";

const currentPath = window.location.pathname;

const transactionsTable = document.querySelector("#transactions-table");
const recurringBillsTable = document.querySelector("#recurring_bills-table");
const totalBills = document.querySelector("#total-bills");
const mobilePagination = document.querySelector("#mobile-pagination");
const desktopPagination = document.querySelector("#desktop-pagination");

if (currentPath.includes("recurring_bills.html")) {
}

export function renderTransactions(transactions) {
  // Implementation for rendering transactions
  transactionsTable.innerHTML = "";
  const currentTransactions = getCurrentPageTransactions();

  transactions = currentTransactions;

  transactions.forEach((transaction) => {
    const dateObj = new Date(transaction.date);
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    // render transaction
    const tableHTML = `      
      <!-- Table Body -->
      <tr>
        <td class="py-4 flex items-center gap-3">
          <!-- Avatar Placeholder -->
          <div
            class="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0"
          >
            <img
              src="${transaction.avatar}"
              alt="${transaction.name}"
              class="w-9 h-9 rounded-full object-cover"
            />              
          </div>
          <span class="pl-4 font-bold text-gray-800"
            >${transaction.name}</span
          >
        </td>
        <td class="py-4 text-gray-500 font-bold hidden md:table-cell">${transaction.category}</td>
        <td class="py-4 text-gray-500 font-bold hidden md:table-cell">${formattedDate}</td>
        <!-- Positive Green Text -->
        <td class="py-4 text-right font-bold ${transaction.amount > 0 ? "text-emerald-600" : "text-gray-800"}">
          $${transaction.amount.toFixed(2)}
        </td>
      </tr>
      
    `;
    transactionsTable.innerHTML += tableHTML;
  });
}

export function renderRecurringBills(getRecurringBills) {
  // Implementation for rendering recurring bills
  recurringBillsTable.innerHTML = "";
  const totalAmount = Number(calculateTotalBills());
  const neutralSign = Math.abs(totalAmount);

  getRecurringBills.forEach((bill) => {
    const dateObj = new Date(bill.date);
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const amount = Number(bill.amount);
    const removeMinus = Math.abs(amount);
    // render recurringBills
    const tableHTML = `      
      <!-- Table Body -->
      <tr>
        <td class="py-4 flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0"
          >
            <img
              src="${bill.avatar}"
              alt="${bill.name}"
              class="w-9 h-9 rounded-full object-cover"
            />              
          </div>
          <span class="pl-4 font-bold text-gray-800"
            >${bill.name}</span
          >
        </td>
        <td class="py-4 text-gray-800 font-bold items-center">
        ${formattedDate}
        </td>
        <td class="py-4 text-right font-bold">
          $${removeMinus.toFixed(2)}
        </td>
      </tr>
    `;
    recurringBillsTable.innerHTML += tableHTML;
  });

  totalBills.innerHTML = `
    <i class="fa-solid fa-receipt text-3xl text-white mb-4"></i>
    <p class="text-2xs text-white mt-2 mb-3">Total Bills</p>
    <p class="text-3xl font-bold text-white">$${neutralSign}</p>
  `;
}

export function renderPaginationBtns() {
  if (currentPath.includes("transactions.html")) {
    mobilePagination.innerHTML = "";
    desktopPagination.innerHTML = "";
    const displayTransactions = displayedTransactions;
    const displayTransactionsLength = displayTransactions.length;
    const transactionsPerPage = 10;
    const totalPages = Math.ceil(
      displayTransactionsLength / transactionsPerPage,
    );
    console.log(totalPages);

    for (let page = 1; page <= totalPages; page++) {
      mobilePagination.innerHTML += `
      <li
         data-page= "${page}"
         class="page-btn border pr-3 pl-3 pt-1 pb-1 mr-3 border-gray-800 rounded-md hover:cursor-pointer"
       >
         ${page}
       </li>
      `;

      desktopPagination.innerHTML += `
       <li
         data-page= "${page}"
         class="page-btn border pr-3 pl-3 pt-1 pb-1 mr-3 border-gray-800 rounded-md hover:cursor-pointer"
       >
         ${page}
       </li>
      `;
    }

    const mobileBtnPage = document.querySelectorAll(
      "#mobile-pagination .page-btn",
    );
    const desktopBtnPage = document.querySelectorAll(
      "#desktop-pagination .page-btn",
    );
    // This is the 0-based index fix as the index is starting from 0 instead of 1
    const index = currentPage - 1;

    // Strips the buttons of it's style whenever it is clicked
    mobileBtnPage.forEach((btn) => {
      btn.classList.remove("bg-gray-900", "text-white");
    });

    // Strips the buttons of it's style whenever it is clicked
    desktopBtnPage.forEach((btn) => {
      btn.classList.remove("bg-gray-900", "text-white");
    });

    const mobileActiveButton = mobileBtnPage.item(index);
    const desktopActiveButton = desktopBtnPage.item(index);

    // Styles the newly clicked button :)
    if (mobileActiveButton) {
      mobileActiveButton.classList.add("bg-gray-900", "text-white");
    }

    // Styles the newly clicked button :)
    if (desktopActiveButton) {
      desktopActiveButton.classList.add("bg-gray-900", "text-white");
    }

    // if (mobileBtnPage) {
    //   const activeButton = mobileBtnPage.item(index);

    //   // Strips the buttons of it's style whenever it is clicked
    //   mobileBtnPage.forEach((btn) => {
    //     if (btn) {
    //       btn.classList.remove("bg-gray-900", "text-white");
    //     }
    //   });

    //   // Styles the newly clicked button :)
    //   if (activeButton) {
    //     activeButton.classList.add("bg-gray-900", "text-white");
    //   }
    // } else {
    //   const activeButton = desktopBtnPage.item(index);

    //   // Strips the buttons of it's style whenever it is clicked
    //   desktopBtnPage.forEach((btn) => {
    //     if (btn) {
    //       btn.classList.remove("bg-gray-900", "text-white");
    //     }
    //   });

    //   // Styles the newly clicked button :)
    //   if (activeButton) {
    //     activeButton.classList.add("bg-gray-900", "text-white");
    //   } else {
    //     console.log("Not Active Button :)");
    //   }
    // }
  }
}

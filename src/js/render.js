/* THIS FILE IS RESPONSIBLE FOR BUILDING THE UI BY RENDERING DATA IN THE WHOLE APPLICATION. IT IS USED TO RENDER THE DATA IN THE DOM.
 */
import {
  getCurrentPageTransactions,
  calculateTotalBills,
  displayedTransactions,
  currentPage,
  calculateMatchingTransactionsTotalAmount,
  getMatchingTransactionsForBudgets,
} from "./main.js";

const currentPath = window.location.pathname;

const transactionsTable = document.querySelector("#transactions-table");
const recurringBillsTable = document.querySelector("#recurring_bills-table");
const totalBills = document.querySelector("#total-bills");
const mobilePagination = document.querySelector("#mobile-pagination");
const desktopPagination = document.querySelector("#desktop-pagination");
const potsContainer = document.querySelector("#grid-container");
const budgetContainer = document.querySelector("#budget-container");
const potsFormContainer = document.querySelector(".form-container");
const budgetsFormContainer = document.querySelector(".budget-form-container");

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
  }
}

export function renderPotsPage(pots) {
  // Implementation for rendering the pots page
  potsContainer.innerHTML = "";

  pots.map((pot) => {
    const potId = pot.id;
    const potName = pot.name;
    const potTotal = pot.total;
    const potTheme = pot.theme;
    const potTarget = pot.target;
    const currentProgress = ((potTotal / potTarget) * 100).toFixed(2);

    potsContainer.innerHTML += `
      <div data-id= "${potId}" class="pot relative bg-white rounded-lg w-full h-auto p-4">
        <div class="first-item flex align-center justify-between">
          <div class="flex align-center">
            <div class="${potTheme} h-5 w-5 rounded-xl mt-2"></div>
            <p class="font-bold text-3xl ml-4">${potName}</p>
          </div>
          <i
            data-btn="1"
            class="dropdown-btn fa-solid fa-ellipsis text-gray-300 text-3xl mt-1.5 hover:cursor-pointer"
          ></i>
        </div>
        <div class="second-item flex align-center justify-between mt-8">
          <p class="font-light text-lg pt-2">Total Saved</p>
          <p class="confirm-money-total font-bold text-4xl ml-4">$${potTotal}</p>
        </div>
        <div class="third-item mt-4">
          <!-- The tracking bar -->
          <div
            class="w-auto h-2 bg-[#f8f4f0] rounded-full overflow-hidden"
          >
            <!-- Change the style width percentage here to update the bar -->
            <div
            style="width: ${currentProgress}%"
            class="confirm-money-progress h-full ${potTheme} rounded-full transition-all duration-500 ease-out"
          ></div>
          </div>
        </div>
        <!-- The labels below the bar -->
        <div
          class="fourth-item flex justify-between mt-4 text-md font-semibold text-gray-400"
        >
          <p class="confirm-money-percentage">${currentProgress}%</p>
          <p>Target of $${potTarget}</p>
        </div>
        <!-- Buttons container -->
        <div class="grid grid-cols-2 gap-3 text-gray-900 mt-10 mb-4">
          <button
            data-btn="2"
            class="add-money-btn border-0 border-none bg-[#f8f4f0] p-4 rounded-lg font-bold hover:cursor-pointer"
          >
            + Add Money
          </button>
          <button
            data-btn="3"
            class="withdraw-money-btn border-0 border-none bg-[#f8f4f0] p-4 rounded-lg font-bold hover:cursor-pointer"
          >
            Withdraw
          </button>
        </div>
        <div
        class="pot-dropdown absolute hidden top-8 right-2 z-10 mt-2 w-auto shadow-lg rounded-md bg-white"
        >
          <div class="py-1">
            <a
              data-pot="edit"
              class="open-edit-modal block px-4 py-2 text-xs border-b-2 border-gray-200 hover:bg-gray-500 text-gray-900 hover:cursor-pointer"
              >Edit Pot</a
            >
            <a
              data-pot="delete"
              class="open-delete-modal block px-4 py-2 text-xs hover:bg-gray-500 text-red-600 hover:cursor-pointer"
              >Delete Pot</a
            >
          </div>
        </div>
       <!-- Add Money to Pot Modal -->
        <div
          class="add-money-modal fixed inset-0 bg-black/75 z-10 hidden justify-center"
        >
          <div
            class="bg-white min-h-[60vh] w-72 overflow-y-auto md:w-140 self-center z-60 p-6 rounded-md"
          >
            <div class="first-item flex align-center justify-between">
              <div>
                <p class="font-bold text-3xl text-gray-900">Add to 'Savings'</p>
              </div>
              <i
                data-btn="4"
                id="close-add-money-modal-btn"
                class="fa-solid fa-circle-plus fa-rotate-by text-3xl pt-1 hover:cursor-pointer"
                style="--fa-rotate-angle: 315deg"
              ></i>
            </div>
            <p class="mt-4 text-gray-500">
              Add money to your pot to keep it seperate from your main balance. As soon
              as you add this money, it will be deducted from your current balance.
            </p>
            <div class="second-item flex align-center justify-between mt-8">
              <p class="font-light text-lg pt-2">Total Saved</p>
              <p class="add-money-total font-bold text-4xl ml-4">$${potTotal}</p>
            </div>
            <div class="third-item mt-4">
              <!-- The tracking bar -->
              <div class="w-auto h-2 bg-[#f8f4f0] rounded-full overflow-hidden">
                <!-- Change the style width percentage here to update the bar -->
                <div
                  style="width: ${currentProgress}%"
                  class="add-money-progress h-full ${potTheme} rounded-full transition-all duration-500 ease-out"
                ></div>
              </div>
              <!-- The labels below the bar -->
              <div
                class="fourth-item flex justify-between mt-4 text-md font-semibold text-gray-400"
              >
                <p class="add-money-percentage">${currentProgress}%</p>
                <p>Target of $${potTarget}</p>
              </div>
              <!-- Target Input -->
              <div class="second-input mt-4">
                <p class="text-gray-500 font-bold">Amount to Add</p>
                <div
                  class="w-full h-13 flex align-center mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl focus:outline-gray-900"
                >
                  <span class="text-gray-400 self-center">$</span>
                  <input
                    type="number"
                    name="number"
                    min="1"
                    step="0.50"
                    class="savings-target-input outline-0 w-full ml-1"
                    autocomplete="given-number"
                    placeholder="1000"
                  />
                </div>
              </div>
              <button
                class="confirm-add-money-btn mt-8 w-full bg-gray-900 text-white font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
              >
                Confirm Addition
              </button>
            </div>
          </div>
        </div>
     
        <!-- Withdraw Money from Pot Modal -->
        <div
          class="withdraw-money-modal fixed inset-0 bg-black/75 z-50 hidden justify-center"
        >
          <div
            class="bg-white min-h-[60vh] w-72 overflow-y-auto md:w-140 self-center z-60 p-6 rounded-md"
          >
            <div class="first-item flex align-center justify-between">
              <div>
                <p class="font-bold text-3xl text-gray-900">Withdraw from 'Savings'</p>
              </div>
              <i
                data-btn="4"
                class="close-withdraw-money-modal-btn fa-solid fa-circle-plus fa-rotate-by text-3xl pt-1 hover:cursor-pointer"
                style="--fa-rotate-angle: 315deg"
              ></i>
            </div>
            <p class="mt-4 text-gray-500">
              Withdraw from pot to put money back in your main balance. This will reduce
              the amount you have in this pot.
            </p>
            <div class="second-item flex align-center justify-between mt-8">
              <p class="font-light text-lg pt-2">New Amount</p>
              <p class="withdraw-money-total font-bold text-4xl ml-4">${potTotal}</p>
            </div>
            <div class="third-item mt-4">
              <!-- The tracking bar -->
              <div class="w-auto h-2 bg-[#f8f4f0] rounded-full overflow-hidden">
                <!-- Change the style width percentage here to update the bar -->
                <div
                  style="width: ${currentProgress}%"
                  class="withdraw-money-progress h-full ${potTheme} rounded-full transition-all duration-500 ease-out"
                ></div>
              </div>
              <!-- The labels below the bar -->
              <div
                class="fourth-item flex justify-between mt-4 text-md font-semibold text-gray-400"
              >
                <p class="withdraw-money-percentage">${currentProgress}%</p>
                <p>Target of $${potTarget}</p>
              </div>
              <!-- Target Input -->
              <div class="second-input mt-4">
                <p class="text-gray-500 font-bold">Amount to Withdraw</p>
                <div
                  class="w-full h-13 flex align-center mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl focus:outline-gray-900"
                >
                  <span class="text-gray-400 self-center">$</span>
                  <input
                    type="number"
                    name="number"
                    min="1"
                    step="0.50"
                    class="withdraw-target-input outline-0 w-full ml-1"
                    autocomplete="given-number"
                    placeholder="1000"
                  />
                </div>
              </div>
              <button
                class="confirm-withdraw-money-btn mt-8 w-full bg-gray-900 text-white font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>

        <!-- Edit New Pot Modal -->
        <div
          class="edit-pot-modal fixed inset-0 bg-black/75 z-10 hidden justify-center"
        >
          <div
            class="bg-white min-h-[60vh] w-72 max-md:m-auto overflow-y-auto md:w-140 self-center z-30 p-6 rounded-md"
          >
            <div class="first-item flex align-center justify-between">
              <div>
                <p class="font-bold text-3xl text-gray-900">Edit Pot</p>
              </div>
              <i
                data-btn="4"
                class="close-edit-modal-btn fa-solid fa-circle-plus fa-rotate-by text-3xl pt-1 hover:cursor-pointer"
                style="--fa-rotate-angle: 315deg"
              ></i>
            </div>
            <p class="mt-4 text-gray-500">
              If your savings target change,feel free to update your pots.
            </p>
            <div class="form-container mt-4">
              <!-- Pot Name Input -->
              <div class="first-input">
                <p class="text-gray-500 font-bold">Pot Name</p>
                <input
                  type="text"
                  id="edit-name-input"
                  autocomplete="given-name"
                  class="w-full h-13 mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl"
                  placeholder="e.g Rainy Days"
                  value="${potName}"
                />
              </div>
              <!-- Target Input -->
              <div class="second-input mt-4">
                <p class="text-gray-500 font-bold">Target</p>
                <div
                  class="w-full h-13 flex align-center mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl focus:outline-gray-900"
                >
                  <span class="text-gray-400 self-center">$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.50"
                    id="edit-target-input"
                    class="outline-0 w-full ml-1"
                    autocomplete="given-number"
                    placeholder="e.g 2000"
                    value="${potTarget}"
                  />
                </div>
              </div>
              <!-- Theme Input -->
              <div class="third-input mt-4">
                <p class="text-gray-500 font-bold">Theme</p>
                <div
                  class="pot-theme-dropdown-btn w-full relative h-13 flex align-center justify-between mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl hover:cursor-pointer"
                >
                  <div class="flex align-center">
                    <div
                      class="pot-theme-preview bg-[#277c78] h-5 w-5 rounded-xl mt-2"
                    ></div>
                    <span class="pot-theme-name font-medium self-center ml-4"
                      >Teal</span
                    >
                  </div>
                  <i class="fa-solid fa-caret-down self-center"></i>

                  <!-- Theme Dropdown -->
                  <div
                    class="pot-theme-dropdown absolute hidden top-12 right-0 z-10 mt-2 w-full origin-top-right shadow-lg rounded-md bg-white"
                  >
                    <div class="py-1">
                      <a
                        data-pottheme="Teal"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                      >
                        <div class="flex align-center">
                          <div
                            class="bg-[#277C78] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4">Teal</span>
                        </div>
                      </a>
                      <a
                        data-pottheme="Charcoal"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        ><div class="flex align-center">
                          <div
                            class="bg-[#626070] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4"
                            >Charcoal</span
                          >
                        </div></a
                      >
                      <a
                        data-pottheme="Turquoise"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        ><div class="flex align-center">
                          <div
                            class="bg-[#82C9D7] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4"
                            >Turquoise</span
                          >
                        </div></a
                      >
                      <a
                        data-pottheme="Peach"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        ><div class="flex align-center">
                          <div
                            class="bg-[#F2CDAC] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4"
                            >Peach</span
                          >
                        </div></a
                      >
                      <a
                        data-pottheme="Violet"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        ><div class="flex align-center">
                          <div
                            class="bg-[#826CB0] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4"
                            >Violet</span
                          >
                        </div></a
                      >
                    </div>
                  </div>
                </div>
              </div>
              <button
                class="edit-pot-btn mt-8 w-full bg-gray-900 text-white font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- Delete Savings Pot Modal -->
        <div
          class="delete-savings-modal fixed inset-0 bg-black/75 z-50 hidden justify-center"
        >
          <div
            class="bg-white min-h-[50vh] w-72 overflow-y-auto md:w-140 self-center z-60 p-8 rounded-md"
          >
            <div class="first-item flex align-center justify-between mt-3">
              <div>
                <p class="font-bold text-3xl text-gray-900">Delete from 'Savings'?</p>
              </div>
              <i
                data-btn="4"
                class="close-delete-savings-modal-btn fa-solid fa-circle-plus fa-rotate-by text-3xl pt-1 hover:cursor-pointer"
                style="--fa-rotate-angle: 315deg"
              ></i>
            </div>
            <p class="mt-4 text-gray-500">
              Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.
            </p>            
            <div class="flex flex-col align-center">
              <button
              class="confirm-delete-savings-btn mt-6 w-full bg-red-500 text-gray-900 font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
              >
                Yes, Confirm Deletion
              </button>
              <button
                class="reject-delete-savings-btn mt-4 w-full text-gray-800 font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
              >
                No, Go Back
              </button> 
            </div>         
          </div>
        </div>
      </div>
    `;
  });
}

export function renderNewPotForm() {
  potsFormContainer.innerHTML = "";

  potsFormContainer.innerHTML = `
    <!-- Pot Name Input -->
    <div class="first-input">
      <p class="text-gray-500 font-bold">Pot Name</p>
      <input
        type="text"
        id="name-input"
        autocomplete="given-name"
        class="w-full h-13 mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl"
        placeholder="e.g Rainy Days"
      />
    </div>
    <!-- Target Input -->
    <div class="second-input mt-4">
      <p class="text-gray-500 font-bold">Target</p>
      <div
        class="w-full h-13 flex align-center mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl focus:outline-gray-900"
      >
        <span class="text-gray-400 self-center">$</span>
        <input
          type="number"
          min="1"
          step="0.50"
          id="target-input"
          class="outline-0 w-full ml-1"
          autocomplete="given-number"
          placeholder="e.g 2000"
        />
      </div>
    </div>
    <!-- Theme Input -->
    <div class="third-input mt-4">
      <p class="text-gray-500 font-bold">Theme</p>
      <div
        class="theme-dropdown-btn w-full relative h-13 flex align-center justify-between mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl hover:cursor-pointer"
      >
        <div class="flex align-center">
          <div
            class="theme-preview bg-[#277c78] h-5 w-5 rounded-xl mt-2"
          ></div>
          <span class="theme-name font-medium self-center ml-4"
            >Teal</span
          >
        </div>
        <i class="fa-solid fa-caret-down self-center"></i>

        <!-- Theme Dropdown -->
        <div
          class="theme-dropdown absolute hidden top-12 right-0 z-10 mt-2 w-full origin-top-right shadow-lg rounded-md bg-white"
        >
          <div class="py-1">
            <a
              data-theme="Teal"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
            >
              <div class="flex align-center">
                <div
                  class="bg-[#277C78] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4">Teal</span>
              </div>
            </a>
            <a
              data-theme="Charcoal"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              ><div class="flex align-center">
                <div
                  class="bg-[#626070] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4"
                  >Charcoal</span
                >
              </div></a
            >
            <a
              data-theme="Turquoise"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              ><div class="flex align-center">
                <div
                  class="bg-[#82C9D7] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4"
                  >Turquoise</span
                >
              </div></a
            >
            <a
              data-theme="Peach"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              ><div class="flex align-center">
                <div
                  class="bg-[#F2CDAC] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4"
                  >Peach</span
                >
              </div></a
            >
            <a
              data-theme="Violet"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              ><div class="flex align-center">
                <div
                  class="bg-[#826CB0] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4"
                  >Violet</span
                >
              </div></a
            >
          </div>
        </div>
      </div>
    </div>
    <button
      class="add-new-pot-btn mt-8 w-full bg-gray-900 text-white font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
    >
      Add Pot
    </button>
  `;
}

export function renderAddMoneyPreview(event, newTotal, newProgress) {
  const savingsAmountInput = event.target.closest(".savings-target-input");
  const potElement = savingsAmountInput.closest(".pot");
  const total = potElement.querySelector(".add-money-total");
  const progress = potElement.querySelector(".add-money-progress");
  const percentage = potElement.querySelector(".add-money-percentage");

  total.textContent = `$${newTotal}`;
  progress.style.width = `${newProgress}%`;
  percentage.textContent = `${newProgress}%`;
}

export function renderWithdrawMoneyPreview(event, newTotal, newProgress) {
  const withdrawAmountInput = event.target.closest(".withdraw-target-input");
  const potElement = withdrawAmountInput.closest(".pot");
  const total = potElement.querySelector(".withdraw-money-total");
  const progress = potElement.querySelector(".withdraw-money-progress");
  const percentage = potElement.querySelector(".withdraw-money-percentage");

  total.textContent = `$${newTotal}`;
  progress.style.width = `${newProgress}%`;
  percentage.textContent = `${newProgress}%`;
}

export function renderAddMoney(event, newTotal, newProgress) {
  const confirmAddition = event.target.closest(".confirm-add-money-btn");
  const potElement = confirmAddition.closest(".pot");
  const total = potElement.querySelector(".confirm-money-total");
  const progress = potElement.querySelector(".confirm-money-progress");
  const percentage = potElement.querySelector(".confirm-money-percentage");

  total.textContent = `$${newTotal}`;
  progress.style.width = `${newProgress}%`;
  percentage.textContent = `${newProgress}%`;
}

export function renderWithdrawMoney(event, newTotal, newProgress) {
  const confirmWithdrawal = event.target.closest(".confirm-withdraw-money-btn");
  const potElement = confirmWithdrawal.closest(".pot");
  const total = potElement.querySelector(".confirm-money-total");
  const progress = potElement.querySelector(".confirm-money-progress");
  const percentage = potElement.querySelector(".confirm-money-percentage");

  total.textContent = `$${newTotal}`;
  progress.style.width = `${newProgress}%`;
  percentage.textContent = `${newProgress}%`;
}

export function renderBudgetsPage(budgets) {
  budgetContainer.innerHTML = "";

  budgets.forEach((budget, index) => {
    const budgetId = budget.id;
    const budgetCategory = budget.category;
    const budgetTheme = budget.theme;
    const budgetMaximum = budget.maximum;
    const matchingTransactions = getMatchingTransactionsForBudgets();
    const singleTransaction = matchingTransactions[index];
    const avatarsHTML = singleTransaction
      .map((transaction) => {
        return `<img src="${transaction.avatar}" alt="" class="w-9 h-9 rounded-full object-cover" > `;
      })
      .join("");
    const namesHTML = singleTransaction
      .map((transaction) => {
        return `<p>${transaction.name}</p>`;
      })
      .join("");
    const amountSpentHTML = singleTransaction
      .map((transaction) => {
        return `<p>-$${Math.abs(transaction.amount)}</p>`;
      })
      .join("");
    const dateHTML = singleTransaction.map((transaction) => {
      const dateObj = new Date(transaction.date);
      const formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return `<p>${formattedDate}</p>`;
    });
    const totalAmount = calculateMatchingTransactionsTotalAmount();
    const singleValue = Math.abs(totalAmount[index]).toFixed(2);
    const remainingValue = (budgetMaximum - singleValue).toFixed(2);
    const percentageSpent = ((singleValue / budgetMaximum) * 100).toFixed(2);

    budgetContainer.innerHTML += `
      <div
        data-id="${budgetId}"
        class="budget relative bg-white rounded-lg w-full h-auto p-4 mb-6"
      >
        <div class="first-item flex align-center justify-between">
          <div class="flex align-center">
            <div class="${budgetTheme} h-5 w-5 rounded-xl mt-2 "></div>
            <p class="font-bold text-3xl ml-4">${budgetCategory}</p>
          </div>
          <i
            data-btn="1"
            class="budget-dropdown-btn fa-solid fa-ellipsis text-gray-300 text-3xl mt-1.5 hover:cursor-pointer"
          ></i>
        </div>
        <div class="second-item flex align-center justify-between mt-4">
          <p class="font-semibold text-gray-600 text-lg pt-2">
            Maximum of $${budgetMaximum}
          </p>
        </div>
        <div class="third-item mt-4">
          <!-- The tracking bar -->
          <div
            class="w-auto h-7 bg-[#f8f4f0] rounded-md overflow-hidden p-1"
          >
            <!-- Change the style width percentage here to update the bar -->
            <div
              style="width: ${percentageSpent}%"
              class="budget-progress ${budgetTheme} h-full rounded-md transition-all duration-500 ease-out"
            ></div>
          </div>
        </div>
        <div class="flex align-center mt-3 pl-1">
          <div class="flex align-center flex-1">
            <div class="h-12 ${budgetTheme} w-1.5 rounded"></div>
            <div class="flex flex-col ml-3">
              <p>Spent</p>
              <p class="font-bold">$${singleValue}</p>
            </div>
          </div>
          <div class="flex align-center flex-2">
            <div class="h-12 bg-[#f8f4f0] w-1.5 rounded"></div>
            <div class="flex flex-col ml-3">
              <p>Remaining</p>
              <p class="font-bold">$${remainingValue < 0 ? 0.0 : remainingValue}</p>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto bg-[#f8f4f0] p-4 w-full rounded-xl mt-8">
          <div class="flex align-center justify-between">
            <p class="text-xl font-bold">Latest Spending</p>
            <a href="./transactions.html">
              <div class="flex align-center justify-between">
                <p>See all</p>
                <i class="fa-solid fa-caret-right text-gray-500 mt-1 ml-1"></i>
              </div>
            </a>
          </div>
          <table class="w-full text-left border-collapse mt-4 ">
            <!-- Table Body -->
            <tr>
              <td class="py-4 flex gap-8">
                <!-- Avatar Placeholder -->
                <div class="w-full flex justify-between align-center">
                  <div class="flex align-center gap-8">
                    <div
                    class="flex flex-col gap-4 overflow-hidden shrink-0"
                    >
                      ${avatarsHTML}
                    </div>
                    <span class=" font-bold text-gray-800 flex flex-col gap-8"
                      >${namesHTML}</span
                    >
                  </div>
                  <div class=" font-bold text-gray-800 flex flex-col gap-8">
                   ${amountSpentHTML}
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Edit | Delete Budget Menu Modal -->
        <div
          class="budget-dropdown absolute hidden top-8 right-2 z-10 mt-2 w-auto shadow-lg rounded-md bg-white"
        >
          <div class="py-1">
            <a
              data-pot="edit"
              class="open-edit-budget-modal block px-4 py-2 text-xs border-b-2 border-gray-200 hover:bg-gray-500 text-gray-900 hover:cursor-pointer"
              >Edit Budget</a
            >
            <a
              data-pot="delete"
              class="open-delete-budget-modal block px-4 py-2 text-xs hover:bg-gray-500 text-red-600 hover:cursor-pointer"
              >Delete Budget</a
            >
          </div>
        </div>

        <!-- Edit Budget Modal -->
        <div
          class="edit-budget-modal fixed inset-0 bg-black/75 z-10 hidden justify-center"
        >
          <div
            class="bg-white min-h-[60vh] w-72 max-md:m-auto overflow-y-auto md:w-140 self-center z-30 p-6 rounded-md"
          >
            <div class="first-item flex align-center justify-between">
              <div>
                <p class="font-bold text-3xl text-gray-900">Edit Budget</p>
              </div>
              <i
                data-btn="4"
                class="close-edit-budget-modal-btn fa-solid fa-circle-plus fa-rotate-by text-3xl pt-1 hover:cursor-pointer"
                style="--fa-rotate-angle: 315deg"
              ></i>
            </div>
            <p class="mt-4 text-gray-500">
              As your budgets change, feel free to update your spending limits.
            </p>
            <div class="form-container mt-4">
              <div class="category-input mt-4">
                <p class="text-gray-500 font-bold">Budget Category</p>
                <div
                  class="edited-budget-category-dropdown-btn w-full relative h-13 flex align-center justify-between mt-2 pl-4 p-2 border-2 border-gray-500 rounded-xl hover:cursor-pointer"
                >
                  <div class="flex align-center">
                    <span class="budget-category-name font-normal self-center"
                      >Entertainment</span
                    >
                  </div>
                  <i class="fa-solid fa-caret-down self-center"></i>

                  <!-- Category Dropdown -->
                  <div
                    class="edited-budget-category-dropdown absolute hidden top-12 right-0 z-10 mt-2 w-full origin-top-right shadow-md rounded-md bg-white"
                  >
                    <div class="py-1">
                      <a
                        data-editedcategory="Entertainment"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >Entertainment</a
                      >
                      <a
                        data-editedcategory="Bills"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >Bills</a
                      >
                      <a
                        data-editedcategory="Groceries"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >Groceries</a
                      >
                      <a
                        data-editedcategory="Dining out"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >Dining Out</a
                      >
                      <a
                        data-editedcategory="Transportation"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >Transportation</a
                      >
                      <a
                        data-editedcategory="Personal care"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >Personal Care</a
                      >
                      <a
                        data-editedcategory="Education"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >Education</a
                      >
                      <a
                        data-editedcategory="Lifestyle"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >Lifestyle</a
                      >
                      <a
                        data-editedcategory="Shopping"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >Shopping</a
                      >
                      <a
                        data-editedcategory="General"
                        class="block px-4 py-2 text-sm hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        >General</a
                      >
                    </div>
                  </div>
                </div>
              </div>
              <!-- Budget Amount Input -->
              <div class="budget-amount-input mt-4">
                <p class="text-gray-500 font-bold">Maximum Spend</p>
                <div
                  class="w-full h-13 flex align-center mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl focus:outline-gray-900"
                >
                  <span class="text-gray-400 self-center">$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.50"
                    id="budget-input"
                    class="outline-0 w-full ml-2"
                    autocomplete="given-number"
                    placeholder="e.g 2000"
                    value="${budgetMaximum}"
                  />
                </div>
              </div>
              <!-- Theme Input -->
              <div class="third-input mt-4">
                <p class="text-gray-500 font-bold">Theme</p>
                <div
                  class="edited-budget-theme-dropdown-btn w-full relative h-13 flex align-center justify-between mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl hover:cursor-pointer"
                >
                  <div class="flex align-center">
                    <div
                      class="budget-theme-preview bg-[#277c78] h-5 w-5 rounded-xl mt-2"
                    ></div>
                    <span class="budget-theme-name font-medium self-center ml-4"
                      >Teal</span
                    >
                  </div>
                  <i class="fa-solid fa-caret-down self-center"></i>

                  <!-- Theme Dropdown -->
                  <div
                    class="edited-theme-dropdown absolute hidden top-12 right-0 z-10 mt-2 w-full origin-top-right shadow-lg rounded-md bg-white"
                  >
                    <div class="py-1">
                      <a
                        data-editedtheme="Teal"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                      >
                        <div class="flex align-center">
                          <div
                            class="bg-[#277C78] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4">Teal</span>
                        </div>
                      </a>
                      <a
                        data-editedtheme="Charcoal"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        ><div class="flex align-center">
                          <div
                            class="bg-[#626070] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4"
                            >Charcoal</span
                          >
                        </div></a
                      >
                      <a
                        data-editedtheme="Turquoise"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        ><div class="flex align-center">
                          <div
                            class="bg-[#82C9D7] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4"
                            >Turquoise</span
                          >
                        </div></a
                      >
                      <a
                        data-editedtheme="Peach"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        ><div class="flex align-center">
                          <div
                            class="bg-[#F2CDAC] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4"
                            >Peach</span
                          >
                        </div></a
                      >
                      <a
                        data-editedtheme="Violet"
                        class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
                        ><div class="flex align-center">
                          <div
                            class="bg-[#826CB0] h-5 w-5 rounded-xl mt-2"
                          ></div>
                          <span class="font-medium self-center ml-4"
                            >Violet</span
                          >
                        </div></a
                      >
                    </div>
                  </div>
                </div>
              </div>
              <button
                class="edit-budget-btn mt-8 w-full bg-gray-900 text-white font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
              >
                Edit Budget
              </button>
            </div>
          </div>
        </div>

        <!-- Delete Savings Pot Modal -->
        <div
          class="delete-budget-modal fixed inset-0 bg-black/75 z-50 hidden justify-center"
        >
          <div
            class="bg-white min-h-[50vh] w-72 overflow-y-auto md:w-140 self-center z-60 p-8 rounded-md"
          >
            <div class="first-item flex align-center justify-between mt-3">
              <div>
                <p class="font-bold text-3xl text-gray-900">Delete '${budgetCategory}'?</p>
              </div>
              <i
                data-btn="4"
                class="close-delete-budget-modal-btn fa-solid fa-circle-plus fa-rotate-by text-3xl pt-1 hover:cursor-pointer"
                style="--fa-rotate-angle: 315deg"
              ></i>
            </div>
            <p class="mt-4 text-gray-500">
              Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.
            </p>            
            <div class="flex flex-col align-center">
              <button
              class="confirm-delete-budget-btn mt-6 w-full bg-red-500 text-gray-900 font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
              >
                Yes, Confirm Deletion
              </button>
              <button
                class="reject-delete-budget-btn mt-4 w-full text-gray-800 font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
              >
                No, Go Back
              </button> 
            </div>         
          </div>
        </div>
      </div>
    `;
  });
}

export function renderNewBudgetForm() {
  budgetsFormContainer.innerHTML = "";

  budgetsFormContainer.innerHTML = `
    <div class="category-input mt-4">
      <p class="text-gray-500 font-bold">Budget Category</p>
      <div
        class="budget-category-dropdown-btn w-full relative h-13 flex align-center justify-between mt-2 pl-4 p-2 border-2 border-gray-500 rounded-xl hover:cursor-pointer"
      >
        <div class="flex align-center">
          <span class="budget-category-name font-normal self-center"
            >Entertainment</span
          >
        </div>
        <i class="fa-solid fa-caret-down self-center"></i>

        <!-- Category Dropdown -->
        <div
          class="budget-category-dropdown absolute hidden top-12 right-0 z-10 mt-2 w-full origin-top-right shadow-md rounded-md bg-white"
        >
          <div class="py-1">
            <a
              data-budgetcategory="Entertainment"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >Entertainment</a
            >
            <a
              data-budgetcategory="Bills"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >Bills</a
            >
            <a
              data-budgetcategory="Groceries"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >Groceries</a
            >
            <a
              data-budgetcategory="Dining out"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >Dining Out</a
            >
            <a
              data-budgetcategory="Transportation"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >Transportation</a
            >
            <a
              data-budgetcategory="Personal care"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >Personal Care</a
            >
            <a
              data-budgetcategory="Education"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >Education</a
            >
            <a
              data-budgetcategory="Lifestyle"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >Lifestyle</a
            >
            <a
              data-budgetcategory="Shopping"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >Shopping</a
            >
            <a
              data-budgetcategory="General"
              class="block px-4 py-2 text-sm hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              >General</a
            >
          </div>
        </div>
      </div>
    </div>
    <!-- Budget Amount Input -->
    <div class="budget-amount-input mt-4">
      <p class="text-gray-500 font-bold">Maximum Spend</p>
      <div
        class="w-full h-13 flex align-center mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl focus:outline-gray-900"
      >
        <span class="text-gray-400 self-center">$</span>
        <input
          type="number"
          min="1"
          step="0.50"
          id="budget-input"
          class="outline-0 w-full ml-2"
          autocomplete="given-number"
          placeholder="e.g 2000"
        />
      </div>
    </div>
    <!-- Theme Input -->
    <div class="third-input mt-4">
      <p class="text-gray-500 font-bold">Theme</p>
      <div
        class="new-budget-dropdown-btn w-full relative h-13 flex align-center justify-between mt-1 pl-4 p-2 border-2 border-gray-500 rounded-xl hover:cursor-pointer"
      >
        <div class="flex align-center">
          <div
            class="budget-theme-preview bg-[#277C78] h-5 w-5 rounded-xl mt-2"
          ></div>
          <span class="budget-theme-name font-medium self-center ml-4"
            >Teal</span
          >
        </div>
        <i class="fa-solid fa-caret-down self-center"></i>

        <!-- Theme Dropdown -->
        <div
          class="budget-theme-dropdown absolute hidden top-12 right-0 z-10 mt-2 w-full origin-top-right shadow-lg rounded-md bg-white"
        >
          <div class="py-1">
            <a
              data-budgettheme="Teal"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
            >
              <div class="flex align-center">
                <div
                  class="bg-[#277C78] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4">Teal</span>
              </div>
            </a>
            <a
              data-budgettheme="Charcoal"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              ><div class="flex align-center">
                <div
                  class="bg-[#626070] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4"
                  >Charcoal</span
                >
              </div></a
            >
            <a
              data-budgettheme="Turquoise"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              ><div class="flex align-center">
                <div
                  class="bg-[#82C9D7] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4"
                  >Turquoise</span
                >
              </div></a
            >
            <a
              data-budgettheme="Peach"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              ><div class="flex align-center">
                <div
                  class="bg-[#F2CDAC] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4"
                  >Peach</span
                >
              </div></a
            >
            <a
              data-budgettheme="Violet"
              class="block px-4 py-2 text-sm border-b-2 border-gray-200 hover:bg-gray-500 hover:text-white hover:cursor-pointer"
              ><div class="flex align-center">
                <div
                  class="bg-[#826CB0] h-5 w-5 rounded-xl mt-2"
                ></div>
                <span class="font-medium self-center ml-4"
                  >Violet</span
                >
              </div></a
            >
          </div>
        </div>
      </div>
    </div>
    <button
      class="add-new-budget-btn mt-8 w-full bg-gray-900 text-white font-bold pt-3 pb-3 rounded-lg hover:cursor-pointer"
    >
      Add Budget
    </button>
  `;
}

/* THIS FILE IS RESPONSIBLE FOR BUILDING THE UI BY RENDERING DATA IN THE WHOLE APPLICATION. IT IS USED TO RENDER THE DATA IN THE DOM.
 */
import {
  getCurrentPageTransactions,
  calculateTotalBills,
  displayedTransactions,
  currentPage,
} from "./main.js";

const currentPath = window.location.pathname;

const transactionsTable = document.querySelector("#transactions-table");
const recurringBillsTable = document.querySelector("#recurring_bills-table");
const totalBills = document.querySelector("#total-bills");
const mobilePagination = document.querySelector("#mobile-pagination");
const desktopPagination = document.querySelector("#desktop-pagination");
const potsContainer = document.querySelector("#grid-container");
const potsFormContainer = document.querySelector(".form-container");

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

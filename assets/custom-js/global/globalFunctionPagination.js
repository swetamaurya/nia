/******************************************************
 * pagination.js
 * Author: Your Name
 ******************************************************/
// (function(){
//   const timestamp = localStorage.getItem('timestampActiveSession');
//   if (timestamp) {
//       const currentTime = Date.now();
//       const timeDiff = currentTime - parseInt(timestamp);
//       let hrs = 9.5; // hrs session active condition
//       if (timeDiff > hrs * 60 * 60 * 1000) {
//           localStorage.clear();
//           window.location.href = 'login.html';
//       }
//   } else {
//       localStorage.clear();
//       window.location.href = 'login.html';
//   }
// })();

(function () {
    // Inject the DataTables-style pagination HTML structure
    document.getElementById("paginationFooter").innerHTML = ` 
      <div class="row">
        <div class="col-sm-12 col-md-5">
          <div class="dataTables_info" id="DataTables_Table_0_info" role="status" aria-live="polite">
            Showing <span id="minDataInPage">1</span> to <span id="maxDataInPage">10</span> of 
            <span id="totalDataInApi">0</span> entries
          </div>
        </div>
        <div class="col-sm-12 col-md-7">
          <div class="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
            <ul class="pagination">
              <li class="paginate_button page-item previous disabled" id="DataTables_Table_0_previous">
                <a href="#" aria-controls="DataTables_Table_0" data-dt-idx="0" tabindex="0" class="page-link">
                  <i class="fa fa-angle-double-left"></i>
                </a>
              </li>
              <li class="paginate_button page-item active">
                <a href="#" id="page-limit-show-pagination" aria-controls="DataTables_Table_0"
                   data-dt-idx="1" tabindex="0" class="page-link">
                  1
                </a>
              </li>
              <li class="paginate_button page-item next disabled" id="DataTables_Table_0_next">
                <a href="#" aria-controls="DataTables_Table_0" data-dt-idx="2" tabindex="0" class="page-link">
                  <i class="fa fa-angle-double-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;
  
    // Inject the "Show entries" dropdown in a separate DOM container
    // document.getElementById("DataTables_Table_0_length").innerHTML = `
    //   <label>Show entries</label>
    //   <select
    //     id="pagination_select_option_number"
    //     name="DataTables_Table_0_length"
    //     aria-controls="DataTables_Table_0"
    //     class="ms-2 custom-select custom-select-sm form-select form-control-sm"
    //     fdprocessedid="2bf78h"
    //   >
    //     <option value="10">10</option>
    //     <option value="25">25</option>
    //     <option value="50">50</option>
    //     <option value="100">100</option>
    //   </select>
    // `;
  })();
  
  // *******************************************************
  // Pagination State
  // *******************************************************
  let apiPageNumber = 1;
  let currentPageApiLimit = 10;
  let totalDataCount = 0;  // keep track of total data from the API
  
  // *******************************************************
  // Getters / Setters
  // *******************************************************
  export function setApiPageNumber(value) {
    apiPageNumber = value;
  }
  
  export function getApiPageNumber() {
    return apiPageNumber;
  }
  
  export function setCurrentPageApiLimit(value) {
    currentPageApiLimit = value;
  }
  
  export function getCurrentPageApiLimit() {
    return currentPageApiLimit;
  }
  
  export function setTotalDataCount(value) {
    document.getElementById("totalDataInApi").innerText = value;
    totalDataCount = value;
  }
  
  export function getTotalDataCount() {
    return totalDataCount;
  }
  
  // *******************************************************
  // Hook DOM elements (once the page is loaded)
  // *******************************************************
  let select_option = document.getElementById("pagination_select_option_number");
  let number_of_buttons_l_f = document.getElementById("page-limit-show-pagination");
  let left_btn_of_l_f = document.getElementById("DataTables_Table_0_previous");
  let right_btn_of_l_f = document.getElementById("DataTables_Table_0_next");
  
  // *******************************************************
  // Table Data Reload Function Placeholder
  // (will be assigned later via pagination_data_handler_function())
  // *******************************************************
  let table_data_reload;
  export function pagination_data_handler_function(table_data_function) {
    table_data_reload = table_data_function;
  }
  
  // *******************************************************
  // Dropdown "Show entries" change
  // *******************************************************
//   select_option.addEventListener("input", function () {
//     setCurrentPageApiLimit(select_option.value);
//     setApiPageNumber(1);
//     number__load_handle();
//   });
  
  // *******************************************************
  // Prev Button
  // *******************************************************
  left_btn_of_l_f.addEventListener("click", function () {
    if (getApiPageNumber() === 1) {
      return;
    }
    setApiPageNumber(getApiPageNumber() - 1);
    number__load_handle();
  });
  
  // *******************************************************
  // Next Button
  // *******************************************************
  right_btn_of_l_f.addEventListener("click", function () {
    // If the maximum item index on the current page
    // is already >= total data, don't increment further
    let currentMaxIndex = getApiPageNumber() * getCurrentPageApiLimit();
    if (currentMaxIndex >= getTotalDataCount()) {
      return;
    }
    setApiPageNumber(getApiPageNumber() + 1);
    number__load_handle();
  });
  
  // *******************************************************
  // Main pagination update function
  // *******************************************************
  function number__load_handle() {
    // Calculate min and max items displayed on this page
    let minItem = (getApiPageNumber() - 1) * getCurrentPageApiLimit() + 1;
    let maxItem = getApiPageNumber() * getCurrentPageApiLimit();
  
    // Optionally clamp the maxItem so it doesn't exceed totalDataCount
    if (maxItem > getTotalDataCount()) {
      maxItem = getTotalDataCount();
    }
  
    // Update the DOM
    document.getElementById("minDataInPage").innerText = minItem;
    document.getElementById("maxDataInPage").innerText = maxItem;
    number_of_buttons_l_f.innerText = getApiPageNumber();
  
    // Reload the table data for the new page
    load_all_data();
  }
  
  function load_all_data() {
    if (table_data_reload) {
      table_data_reload(); 
    }
  }
  
  // *******************************************************
  // Return your final "?limit=XX&page=YY" for API usage
  // *******************************************************
  export function getParameters() {
    return `?limit=${getCurrentPageApiLimit()}&page=${getApiPageNumber()}`;
  }
  
  // *******************************************************
  // Example: Reset pagination after a global delete, etc.
  // *******************************************************
  export function forGloablDelete_js() {
    setApiPageNumber(1);
    setCurrentPageApiLimit(10);
    if(select_option == null){
      load_all_data()
    }
    else{
    select_option.value = getCurrentPageApiLimit();
    number__load_handle();
    }
  }
  
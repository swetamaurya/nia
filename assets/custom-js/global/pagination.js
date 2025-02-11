// pagination.js
let paginationFooter = document.getElementById('paginationFooter');
let currentPage = 1;     // Tracks the current page
let limit = 10;         // Results per page
let totalEntries = 0;   // Total entries
let totalPages = 0;     // Total pages
let tableDataReload;    // Function to reload data

export function showTotalEntries(entries, totalPage) {
  totalEntries = entries || 0;
  totalPages = totalPage || 1;

  let paginationContent = '';
  let startPage = Math.max(1, currentPage - 1); // Start from the previous page
  let endPage = Math.min(totalPages, startPage + 5); // Show next 5 pages max

  if (totalPages > 10) {
    if (currentPage > 2) {
      paginationContent += `
        <li class="page-item" onclick="getIndex(1)">
          <a class="page-link">1</a>
        </li>`;
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContent += `
        <li id="pageItem${i}" class="page-item ${i === currentPage ? 'active' : ''}" onclick="getIndex(${i})">
          <a class="page-link">${i}</a>
        </li>
      `;
    }

    if (endPage < totalPages - 4) {
      paginationContent += `
        <li class="page-item disabled">
          <a class="page-link">...</a>
        </li>
      `;

      for (let i = totalPages - 3; i <= totalPages; i++) {
        paginationContent += `
          <li class="page-item ${i === currentPage ? 'active' : ''}" onclick="getIndex(${i})">
            <a class="page-link">${i}</a>
          </li>
        `;
      }
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      paginationContent += `
        <li id="pageItem${i}" class="page-item ${i === currentPage ? 'active' : ''}" onclick="getIndex(${i})">
          <a class="page-link">${i}</a>
        </li>
      `;
    }
  }

  paginationFooter.innerHTML = `
    <span class="text-gray-900">
      Showing ${((currentPage - 1) * limit) + 1}
      to ${Math.min(currentPage * limit, totalEntries)}
      of ${totalEntries} entries
    </span>
    <ul id="paginationPages" class="meraPaginationHai pagination flex-align flex-wrap">
      <button id="previousBtn" ${currentPage === 1 ? 'disabled' : ''}> << </button>
      ${paginationContent}
      <button id="nextBtn" ${currentPage === totalPages ? 'disabled' : ''}> >> </button>
    </ul>
  `;

  document.getElementById('previousBtn').addEventListener('click', () => {
    if (currentPage > 1) getIndex(currentPage - 1);
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentPage < totalPages) getIndex(currentPage + 1);
  });
}


/**
 * Sets the reload function that gets called 
 * whenever pagination changes pages.
 */
export function paginationDataHandler(tableDataLoad) {
  tableDataReload = tableDataLoad;
  // Load the initial page of data
  tableDataReload();
}

/**
 * Called whenever a page link is clicked.
 * Updates currentPage, reloads the data, 
 * and highlights the active page.
 */
window.getIndex = function(index) {
  if (currentPage !== index) {
    currentPage = index;
    tableDataReload();
    updateActiveClass(index);
  }
};

/**
 * Returns a query string with ?limit=...&page=... 
 * for your fetch calls.
 */
export function getParameters() {
  return `?limit=${limit}&page=${currentPage}`;
}

/**
 * Adds the "active" class to whichever page is current.
 */
function updateActiveClass(index) {
  let paginationItems = document.querySelectorAll('#paginationPages .page-item');
  paginationItems.forEach(item => item.classList.remove('active'));
  let currPage = document.getElementById(`pageItem${index}`);
  if (currPage) {
    currPage.classList.add('active');
  }
}

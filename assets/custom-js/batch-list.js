if (!localStorage.getItem("token")) {
  localStorage.clear();
  window.location.href = 'sign-in.html';
}
import { BATCH_GETALL_API,BATCH_Category_GETALL_API, USER_GETALL_API, USER_UPDATE_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { individual_delete, objects_data_handler_function } from "./global/delete.js";
import { showTotalEntries, getParameters, paginationDataHandler } from "./global/pagination.js";
import { checkbox_function } from './global/multi_checkbox.js';

window.individual_delete = individual_delete;

const token = localStorage.getItem('token')
// ==============================================================================
//===============================================================================
//Get All API to show the data



async function all_data_load_dashboard() {
  try {
    loading_shimmer(); // Show loading animation
  } catch (error) {
    console.error("Error showing shimmer:", error);
  }

  const tableData = document.getElementById("employee-list-table-data");
  tableData.innerHTML = ''; // Clear existing table rows
  let rows;

  try {

    const response = await fetch(`${BATCH_GETALL_API}${getParameters()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

 
    const res = await response.json();
    const data = res?.data || [];
    console.log("Data received:", data);

    //  Check if `pagination` exists separately
    const totalCount = res?.pagination?.totalCount ?? 0;
    const totalPages = res?.pagination?.totalPages ?? 1;

    console.log("Total Records:", totalCount);
    console.log("Total Pages:", totalPages);
    console.log("Data Length:", data.length);

 

    if (data && data.length > 0) {
        rows = data.map((e) => {
        return `
                             <tr data-id="${e?._id || "-"}">
                    <td><input type="checkbox" class="checkbox_child" value="${
                      e?._id || "-"
                    }"></td>

            <td>
              <span class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill">
                ${e?.batchId ?? '-'}
              </span>
            </td>
            <td>
              <span class="h6 mb-0 fw-medium text-gray-300">${e?.createdAt?.split(' ')[0] ?? '-'}</span>
            </td>
            <td>
              <span class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill text-truncate" >
                ${e?.batchTitle ?? '-'}
              </span>
            </td>
            <td>
              <span class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill">
                ${e?.batchYear ?? '-'}
              </span>
            </td>
            <td>
              <span class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill">
                ${e?.totalDays ?? '-'}
              </span>
            </td>
            <td>
              <div class="btn--container d-flex justify-content-start">
                <a href="edit-batch.html?id=${e?._id}" class="action-btn me-5" title="Edit">
                  <i class="ph ph-pencil"></i>
                </a>
               <a data-bs-toggle="modal" data-bs-target="#delete_data"
   class="action-btn btn--danger btn-outline-danger form-alert"
    onclick="individual_delete('${e?._id || "-"}')">
   <i class="ph ph-trash"></i>
</a>
              </div>
            </td>
          </tr>`;
        });
        tableData.innerHTML = rows.join("");
        checkbox_function();
        showTotalEntries(totalCount, totalPages);
      } else {
        rows = `
                      <tr>
                          <td  colspan="9" class='text-center'><i class="fa-solid fa-times"></i>No Data Found</td>
                      </tr>`;
  
        tableData.innerHTML = rows;
      }
    } catch (error) {
      rows = `
                  <tr>
                      <td  colspan="9" class='text-center'><i class="fa-solid fa-times"></i>No Data Found</td>
                  </tr>`;
  
      tableData.innerHTML = rows;
  
      console.error("Error loading employee data:", error);
    }
    // ----------------------------------------------------------------------------------------------------
    try {
      remove_loading_shimmer();
    } catch (error) {
      console.log(error);
    }
  }


objects_data_handler_function(all_data_load_dashboard);

// Initial function to load data and set up pagination
paginationDataHandler(all_data_load_dashboard);

all_data_load_dashboard();



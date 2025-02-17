if (!localStorage.getItem("token")) {
  localStorage.clear();
  window.location.href = 'sign-in.html';
}
import { STUDENT_GETALL_API, EXPORT_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
import { showTotalEntries, getParameters, paginationDataHandler } from "./global/pagination.js";
import { individual_delete, objects_data_handler_function } from "./global/delete.js";
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
    const tableData = document.getElementById("student-list-table-data");
    tableData.innerHTML = ''; // Clear existing table rows
    let rows;

 

  try {
       const response = await fetch(`${STUDENT_GETALL_API}${getParameters()}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: token,
          },
      });
 
      const res = await response.json();
      const data = res?.students || [];
      console.log("data: ", data);
 
      const totalStudents = res?.pagination?.totalStudents ?? 0;
      const totalPages = res?.pagination?.totalPages ?? 1;
  
 
      if (data && data.length > 0) { 
       
        rows = data.map((e) => {
                          const first_name = e.first_name || "";
                const last_name  = e.last_name || "";
        // const userId  = user.userId || "";
               const fullName  = (first_name + " " + last_name).trim();
               return `
               <tr data-id="${e?._id || "-"}">
      <td><input type="checkbox" class="checkbox_child" value="${
        e?._id || "-"
      }"></td>
                                <td>
                                    <div class="flex-align gap-8">
                                        <img src="${e.photo_path}" alt="" class="w-40 h-40 rounded-circle">
                                        <span class="h6 mb-0 fw-medium text-gray-300">${fullName}</span>
                                    </div>
                                </td>

                <td>
                  <span
                    class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill"
                    >${e.email || ''}</span
                  >
                </td>
                <td>
                  <span
                    class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill"
                    >${e.application_number || '-'}</span
                  >
                </td>
                <td>
                <span
                    class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill"
                    >${e.apply_for || '-'}</span
                  >
                  
                </td>
                <td>
                <span
                    class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill"
                    >${e.category || '-'}</span
                  >
                  
                </td>
                <td>
                <span
                    class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill"
                    >${e.createdAt.split(' ')[0] || '-'}</span
                  >
                  
                </td>
                <td>
                  <div class="btn--container d-flex justify-content-start">
                    <a href="edit-student.html?id=${e._id}" class="action-btn me-5" title="Edit">
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
        showTotalEntries(totalStudents, totalPages);
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

let selectedIdArr = [];
let table = document.getElementById('student-list-table-data');
let checkboxAll = document.querySelector('.checkbox_all');

// Event listener for individual checkboxes
table.addEventListener('change', (event) => {
    if (event.target.classList.contains('checkbox_child')) {
        if (event.target.checked) {
            selectedIdArr.push(event.target.value);
        } else {
            selectedIdArr = selectedIdArr.filter(id => id !== event.target.value);
        }
    }
});

// Event listener for "Select All" checkbox
checkboxAll.addEventListener('change', (event) => {
    let checkbox_child = document.querySelectorAll('.checkbox_child');

    if (event.target.checked) {
        selectedIdArr = Array.from(checkbox_child).map(e => e.value);
    } else {
        selectedIdArr = [];
    }

    checkbox_child.forEach(e => e.checked = event.target.checked);
});

// Export Button Click Handler
let exportBtn = document.getElementById('exportButton');
exportBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    
    try {
        loading_shimmer();
    } catch (error) {
        console.log(error);
    }

    try {
        const requestData = selectedIdArr.length > 0 
            ? { "_id": selectedIdArr } 
            : {}; // Empty object to indicate export all data

        const response = await fetch(`${EXPORT_API}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify(requestData),
        });

        try {
            remove_loading_shimmer();
        } catch (error) {
            console.log(error);
        }

        const success = response.ok;
        status_popup(success ? "Data Exported Successfully!" : "Please try again later", success);

        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            
            link.href = url;
            link.download = 'exported_file.xlsx';
            link.click();
            
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Failed to fetch the file');
        }
    } catch (error) {
        console.error("Error exporting data:", error);
        status_popup("Please try again later", false);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.log(error);
    }
});

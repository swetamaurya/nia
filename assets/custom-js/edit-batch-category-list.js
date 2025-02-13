import { BATCH_Category_GET_API,STUDENT_UPDATE_API } from './global/apis.js';
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
import { individual_delete, objects_data_handler_function } from "./global/delete.js";
import { showTotalEntries, getParameters, paginationDataHandler } from "./global/pagination.js";
import { checkbox_function } from './global/multi_checkbox.js';

window.individual_delete = individual_delete;

const token = localStorage.getItem('token');
let id = new URLSearchParams(window.location.search).get('id');


 
// **Function to load batch details**
async function all_data_load_dashboard() {
    try {
        loading_shimmer(); // Show loading animation
    } catch (error) {
        console.error("Error showing shimmer:", error);
    }

    const createList = document.getElementById('createList');
    const tableData = document.getElementById("student-list-table-data");

    if (!tableData) {
        console.error("Table element not found in DOM.");
        return;
    }
    tableData.innerHTML = ''; // Clear existing table rows

    try {
        const paginationParams = getParameters(); // Get pagination parameters
        const API = `${BATCH_Category_GET_API}?_id=${id}&${paginationParams}`;
        console.log("Fetching API:", API);

        const response = await fetch(API,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data. HTTP Status: ${response.status}`);
        }

        const res = await response.json();
        console.log("API Response:", res);

        const batch = res?.batch;
        if (!batch) {
            console.warn("No batch data found.");
            return;
        }

        if (createList) {
            createList.textContent = batch.createList || "N/A";
        }

        const students = batch.student || [];
        let rows = "";

        const totalCount = res?.pagination?.totalCount || 0;
        const totalPages = res?.pagination?.totalPages || 1;

        
        if (students.length > 0) {
            rows = students.map((student, index) => `
                <tr data-id="${student?._id || '-'}">
                    <td><input type="checkbox" class="checkbox_child" value="${student?._id || '-'}"></td>
                    <td><p class="h6 mb-0 fw-medium text-gray-300">${index + 1}</p></td>
                    <td>
                        <img src="${student?.photo_path || 'assets/images/thumbs/upload-image.png'}" alt="Profile" class="rounded-circle" style="width:40px;height:40px;">
                        <span class="h6 mb-0 fw-medium text-gray-300">${student?.first_name || "-"} ${student?.last_name || "-"}</span>
                    </td>
                    <td><span class="h6 mb-0 fw-medium text-gray-300">${student?.email || "-"}</span></td>
                    <td><span class="h6 mb-0 fw-medium text-gray-300">${student?.application_number || "-"}</span></td>
                    <td><span class="h6 mb-0 fw-medium text-gray-300">${student?.registration_number || "-"}</span></td>
                    <td>
                        <div
                onclick="editStatusById('${student._id}', event)"
                class="form-check form-switch"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  ${student.status === "Active" ? "checked" : ""}
                />
              </div>
                    </td>
                    <td>
                        <div class="btn--container d-flex justify-content-start">
                            <a href="edit-student.html?id=${student._id}" class="edit-btn action-btn me-5" title="View">
                                <i class="ph ph-eye"></i>
                            </a>
                            <a data-bs-toggle="modal" data-bs-target="#delete_data"
                               class="action-btn btn--danger btn-outline-danger form-alert"
                               onclick="individual_delete('${student?._id || '-'}')">
                               <i class="ph ph-trash"></i>
                            </a>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            rows = `
                <tr>
                    <td colspan="9" class='text-center'><i class="fa-solid fa-times"></i> No Students Found</td>
                </tr>`;
        }

        tableData.innerHTML = rows;

        checkbox_function();
        showTotalEntries(totalCount, totalPages);
        // addToggleEventListeners(); //   Add event listeners after rendering

    } catch (error) {
        console.error("Error loading batch data:", error);
        status_popup("Error fetching batch details!", "error");

        tableData.innerHTML = `
            <tr>
                <td colspan="9" class='text-center'><i class="fa-solid fa-times"></i> No Data Found</td>
            </tr>`;
    } finally {
        try {
            remove_loading_shimmer();
        } catch (error) {
            console.error("Error removing shimmer:", error);
        }
    }
}

objects_data_handler_function(all_data_load_dashboard);

window.editStatusById = async function editStatusById(id, event) {
    const element = event.target;
    let updatedStatus = element.checked ? "Active" : "In-Active";
  
    try {
      const response = await fetch(STUDENT_UPDATE_API, {
        method: "POST", // ✅ Use PATCH instead of POST for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          _id: id,
          status: updatedStatus
        })
      });
  
      const result = await response.json();
      console.log("Update status response:", result);
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to update status");
      }
  
      // ✅ Optionally refresh data
      // all_data_load_list();
  
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
      element.checked = !element.checked; // ✅ Revert checkbox if update fails
    }
  };
  
 
// 2) Tell pagination which function to call whenever page/limit changes
paginationDataHandler(all_data_load_dashboard);

  
all_data_load_dashboard();



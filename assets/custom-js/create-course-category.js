if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
import { 
    COURSE_category_CREATE_API, 
    COURSE_category_GETALL_API, 
    COURSE_category_UPDATE_API 
} from './global/apis.js';

import { 
    loading_shimmer, 
    remove_loading_shimmer 
} from "./global/loading_shimmer.js";

import { status_popup } from "./global/status_popup.js";
import { 
    showTotalEntries, 
    getParameters, 
    paginationDataHandler 
} from "./global/pagination.js";

import { 
    checkbox_function
} from "./global/multi_checkbox.js";

import { 
    individual_delete, 
    objects_data_handler_function 
} from "./global/delete.js";


window.individual_delete = individual_delete;

const token = localStorage.getItem('token');

/**
 *  Create Course Category
 */
async function createCourseCategory(event) {
    event.preventDefault(); // Prevent page reload

    const categoryName = document.getElementById('courseCategory').value;

    if (!categoryName) {
        status_popup("Category name is required", false);
        return;
    }

    console.log("Sending request to:", COURSE_category_CREATE_API); // Debugging

    try {
        loading_shimmer();
    } catch (error) {
        console.log(error);
    }

    try {
 const API =  COURSE_category_CREATE_API ;
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token  // Ensure token is correct
            },
            body: JSON.stringify({categoryName })  // Fix: Correct payload
        });

        const result = await response.json();
        console.log('Response:', result);

        status_popup(result?.message, response.ok);

        if (response.ok) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    } catch (error) {
        console.log("Error:", error);
        status_popup("Something went wrong!", false);
    } finally {
        remove_loading_shimmer();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");  // Debugging check

    // Get the Submit button
    const submitButton = document.getElementById('submit');
    console.log("Submit Button:", submitButton);  // Debugging check

    if (submitButton) {
        submitButton.addEventListener('click', (event) => {
            console.log("Submit button clicked"); // Debugging check
            createCourseCategory(event);
        });
    } else {
        console.error("Submit button not found!");
    }

     
});
 
async function all_data_load_dashboard() {
    try {
        loading_shimmer();
    } catch (error) { console.log(error) }
    // -----------------------------------------------------------------------------------
   
    const tableData = document.getElementById('employee-list-table-data')
    tableData.innerHTML = '';
    let rows;

    try {
   
   
    const response = await fetch(`${COURSE_category_GETALL_API}${getParameters()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token  // Removed 'Bearer '
            }
        });

        const res = await response.json();
        console.log("Fetched Categories:", res);

        const courses = res?.categories || [];
        console.log("Processed courses Data:", courses); // Debugging

        const totalCoursesCategories = res?.pagination?.totalCoursesCategories ?? 0;
        const totalPages = res?.pagination?.totalPages ?? 1;
    
        if (courses && courses.length > 0) {
            rows = courses.map((e, index) => {
                return `
                 <tr data-id="${e?._id || "-"}">
                    <td><input type="checkbox" class="checkbox_child" value="${
                      e?._id || "-"
                    }"></td>
<td>
                        <p class="h6 mb-0 fw-medium text-gray-300">${index + 1}</p>
                    </td>
                    <td>
                        <span class="h6 mb-0 fw-medium text-gray-300">${e.categoryName || "-"}</span>
                    </td>
                      
                    <td>
                            <div
                onclick="editStatusById('${e._id}', event)"
                class="form-check form-switch"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  ${e.status === "Active" ? "checked" : ""}
                />
              </div>
                        </td>
                    <td>
<div class="btn--container d-flex justify-content-start">
    
    
    <a data-bs-toggle="modal" data-bs-target="#delete_data"
class="action-btn btn--danger btn-outline-danger form-alert"
onclick="individual_delete('${e?._id || '-'}')">
<i class="ph ph-trash"></i>
</a>
</div>
</td>

                </tr>`;
            })
            tableData.innerHTML = rows.join('');
            checkbox_function();
            showTotalEntries(totalCoursesCategories, totalPages);

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

        console.error('Error loading employee data:', error);
    }
    // ----------------------------------------------------------------------------------------------------
    try {
        remove_loading_shimmer();
    } catch (error) { console.log(error) }

}

objects_data_handler_function(all_data_load_dashboard);

window.editStatusById = async function editStatusById(id, event) {
  const element = event.target;
  let updatedStatus = element.checked ? "Active" : "In-Active";

  try {
    const response = await fetch(COURSE_category_UPDATE_API , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        _id: id,
        status: updatedStatus,
      }),
    });

    const result = await response.json();
    // console.log("Update status response:", result);

    if (!response.ok) {
      throw new Error(result.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status. Please try again.");
    element.checked = !element.checked; //
  }
};

// 2) Tell pagination which function to call whenever page/limit changes
paginationDataHandler(all_data_load_dashboard);

all_data_load_dashboard();

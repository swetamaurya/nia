// employee-list.js
if (!localStorage.getItem("token")) {
  localStorage.clear();
  window.location.href = 'sign-in.html';
}
import { USER_GETALL_API, USER_UPDATE_API } from "./global/apis.js";
import {
 
  showTotalEntries,
  getParameters,
  paginationDataHandler
} from "./global/pagination.js"; 
import {
  checkbox_function,
//   enableBtns,disableBtns
} from "./global/multi_checkbox.js";
import {
  individual_delete,
  objects_data_handler_function
} from "./global/delete.js";

// For "individual_delete" if your code uses it
window.individual_delete = individual_delete;

// We'll store the token from localStorage
const token = localStorage.getItem("token");

/**
 * Load employees from server, populate table, 
 * then update pagination & multi-checkbox logic.
 */
async function all_data_load_list() {
  try {
    // (Optional) show a spinner if you have a "loading_shimmer()" function
    // loading_shimmer();
  } catch (err) {
    console.error(err);
  }

  try {
    // Clear table
    const tbody = document.getElementById("employee-list-table-data");
    tbody.innerHTML = "";

    // Build API with pagination parameters
    const API = `${USER_GETALL_API}${getParameters()}`;
    const response = await fetch(API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }

    const r1 = await response.json();
    const data = r1?.data || [];

    // Suppose r1?.pagination has totalUsers & totalPages
    const totalUsers = r1?.pagination?.totalUsers || 0;
    const totalPages = r1?.pagination?.totalPages || 1;

    // Build rows
    let rowHtml = "";
    if (totalUsers > 0 && data.length) {
      data.forEach((user) => {
        const firstName = user.firstName || "";
        const last_name  = user.last_name || "";
        const userId  = user.userId || "";
        const fullName  = (firstName + " " + last_name).trim();
        const imageUrl  = user.image || "";

        rowHtml += ` 
          <tr data-id='${user._id}'>
            <td class="employee_restriction_d_none"><input type="checkbox" class="checkbox_child" value="${user._id}"></td>
            <td>
              <div class="flex-align gap-8">
                <a href="employee-profile.html?id=${user._id}">
                  <img
                    src="${imageUrl}"
                    alt=""
                    class="w-40 h-40 rounded-circle"
                  />
                 <span class="h6 mb-0 fw-medium text-gray-300">
    ${`${fullName} (${userId})` || '-'}
</span>
                </a>
              </div>
            </td>
            <td>
              <h6 class="m-0">
                <a
                  href="mailto:${user.email || '#'}"
                  class="text-hover text-gray-300"
                >
                  ${user.email || '-'}
                </a>
              </h6>
              <div class="mt-2">
                <a
                  href="tel:${user.phoneNumber || '#'}"
                  class="text-hover text-gray-300"
                >
                  ${user.phoneNumber || '-'}
                </a>
              </div>
            </td>
            <td>
              <span class="bg-success-50 text-bg-primary h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill">
                ${user.roles?.roles || '-'}
              </span>
            </td>
            <td>
              <div
                onclick="editStatusById('${user._id}', event)"
                class="form-check form-switch"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  ${user.status === "Active" ? "checked" : ""}
                />
              </div>
            </td>
            <td>
              <div class="btn--container d-flex justify-content-start">
                <a 
                  href="update-employee.html?id=${user._id}"
                  class="action-btn me-5"
                  title="Edit"
                >
                  <i class="ph ph-pencil"></i>
                </a>
                <a data-bs-toggle="modal" data-bs-target="#delete_data"
   class="action-btn btn--danger btn-outline-danger form-alert"
    onclick="individual_delete('${user?._id || "-"}')">
   <i class="ph ph-trash"></i>
</a>

              </div>
            </td>
          </tr>
        `;
      });
    } else {
      rowHtml = `
        <tr>
          <td colspan="6" class="text-center">Data Not Found.</td>
        </tr>
      `;
    }

    // Insert rows
    tbody.innerHTML = rowHtml;

    // Re‐initialize the checkboxes (Select All / Child)
    checkbox_function();

    // Update pagination display
    showTotalEntries(totalUsers, totalPages);

  } catch (error) {
    console.error("Error in all_data_load_list:", error.message);
  } finally {
    // (Optional) remove spinner
    // remove_loading_shimmer();
  }
}

// If you have a function that might delete an item & need to refresh afterwards
objects_data_handler_function(all_data_load_list);

/** 
 * Example status update function used in the row:
 * <div onclick="editStatusById('${user._id}', event)" ... >
 */
window.editStatusById = async function editStatusById(id, event) {
  const element = event.target;
  let updatedStatus = element.checked ? "Active" : "In-Active";

  // Build form data
  const formData = new FormData();
  formData.append("_id", id);
  formData.append("status", updatedStatus);

  const response = await fetch(USER_UPDATE_API, {
    method: "POST",
    headers: {
      Authorization: token
    },
    body: formData
  });
  const result = await response.json();
  console.log("Update status response:", result);

  // If needed, refresh the data
  // all_data_load_list();
};

// 1) Initialize pagination
// initPagination("paginationFooter", "pageSizeDropdown");

// 2) Tell pagination which function to call whenever page/limit changes
paginationDataHandler(all_data_load_list);

// 3) Load data the first time
all_data_load_list();

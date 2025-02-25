if (!localStorage.getItem("token")) {
  localStorage.clear();
  window.location.href = 'sign-in.html';
}
import { ROLE_CREATE,ROLE_GETALL_API,ROLE_UPDATE_API,USER_GETALL_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
import { individual_delete, objects_data_handler_function } from "./global/delete.js";
import { showTotalEntries, getParameters, paginationDataHandler } from "./global/pagination.js";
import { checkbox_function } from './global/multi_checkbox.js';

window.individual_delete = individual_delete;
const token = localStorage.getItem('token')
// ==============================================================================
// ==============================================================================

//Creating Array for the Role
let permissions=[];
function isChecked(){
    let dashboardObj={
     dashboardManagement: document.getElementById('dashboard-Management'),
     employeeManagement: document.getElementById('employee-Management'),
     courseManagement: document.getElementById('course-Management'),
     classManagement: document.getElementById('class-Management'),
     studentManagement: document.getElementById('student-Management'),
     MessagesManagement: document.getElementById('messages'),
     systemManagement: document.getElementById('system-Management'),
    }
    Object.keys(dashboardObj).forEach((key)=>{
        const element = dashboardObj[key];
        if (element.checked) {
            // Add to the array only if it's not already present
            if (!permissions.includes(element.value)) {
                permissions.push(element.value);
            }
        }
        else {
            // Remove the value from the array if unchecked
            const index = permissions.indexOf(element.value);
            if (index > -1) {
                permissions.splice(index, 1);
            }
        }
    })
}
document.getElementById('dashboard-Management').addEventListener('change',isChecked)
document.getElementById('employee-Management').addEventListener('change',isChecked)
document.getElementById('course-Management').addEventListener('change',isChecked)
document.getElementById('class-Management').addEventListener('change',isChecked)
document.getElementById('student-Management').addEventListener('change',isChecked)
document.getElementById('messages').addEventListener('change',isChecked)
document.getElementById('system-Management').addEventListener('change',isChecked)
document.getElementById('select_all').addEventListener('change',isChecked)


//=======================================================================================
//Create API call for the Role....

let addRoleForm = "add-role-form";
document.getElementById(addRoleForm).addEventListener("submit", async function (event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error);}
    // -----------------------------------------------------------------------------------
    // debugger
    try{
        const roles = document.getElementById('role').value.trim();
        const name = document.getElementById('employeeDropdown').value.trim(); 
        let requestBody = { roles, permissions };
        if (name!="" && name!=undefined) {
            requestBody.name = name;
        }
        const API = `${ROLE_CREATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify( requestBody ),
        });
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();
        console.log('THIS IS MY RESPONSE: ',r1)
        // -----------------------------------------------------------------------------------
        try{
            status_popup(r1?.message, (response?.ok));
            
        if (response.ok) {
          setTimeout(() => {
              window.location.reload();
          }, 1000);
      }
        } catch(error){console.log(error)}
    } catch(error){
        status_popup( ("Invalid Credentials"), (false));
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try{
        document.getElementById(addRoleForm).reset();
        remove_loading_shimmer();
    } catch(error){console.log(error);}
});

//Get All API to show the data

async function all_data_load_dashboard() {
  try {
    if (typeof loading_shimmer === "function") {
      loading_shimmer(); // Show loading animation
    }
  } catch (error) {
    console.error("Error showing shimmer:", error);
  }

  let tbody = document.getElementById("role-table-data");
  tbody.innerHTML = "";
  let row = "";

  try {
    const response = await fetch(`${ROLE_GETALL_API}${getParameters()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const r1 = await response.json();
    console.log("THIS IS MY DATA: ", r1);
    const data = r1?.roles;

    let totalRole = r1?.pagination?.total || 0;
    let totalPage = r1?.pagination?.totalPages || 0;

    if (Array.isArray(data) && totalRole > 0) {
      try {
        data.forEach((e, i) => {
          row += `
            <tr data-id="${e?._id || "-"}">
              <td><input type="checkbox" class="checkbox_child" value="${e?._id || "-"}"></td>
              <td>
                <div class="flex-align gap-8">
                  <span class="h6 mb-0 fw-medium text-gray-300">${i + 1}</span>
                </div>
              </td>
              <td>
                <span class="h6 mb-0 fw-medium text-gray-300">${e.roles}</span>
              </td>
              <td>
                <span class="h6 mb-0 fw-medium text-gray-300">
                  ${
                    e?.name?.first_name || e?.name?.last_name || e?.name?.userId
                      ? [e?.name?.first_name, e?.name?.last_name, `(${e?.name?.userId})`]
                          .filter(Boolean)
                          .join(" ")
                      : "-"
                  }
                </span>
              </td>
              <td>
                ${
                  e.permissions
                    .map((ee, ii) => {
                      return ii === 3 || ii === 6
                        ? `<br/><span class="h6 mb-0 fw-medium text-gray-300">${ee}, </span>`
                        : `<span class="h6 mb-0 fw-medium text-gray-300">${ee}, </span>`;
                    })
                    .join("")
                }
              </td>
              <td>
                <div onclick="editStatusById('${e._id}',event)" class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked"
                    ${e.status == "Active" ? "checked" : ""} />
                </div>
              </td>
              <td>
                <div class="btn--container d-flex justify-content-start">
                  <a href="update-role.html?id=${e._id}" class="action-btn me-5" title="Edit">
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

        tbody.innerHTML = row; //   Removed .join('') (Not Needed)
        checkbox_function();
        showTotalEntries(totalRole, totalPage);
      } catch (error) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" class='text-center'><i class="fa-solid fa-times"></i> No Data Found</td>
          </tr>`;
        console.error("Error processing data:", error);
      }
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class='text-center'><i class="fa-solid fa-times"></i> No Data Found</td>
        </tr>`;
    }
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class='text-center'><i class="fa-solid fa-times"></i> No Data Found</td>
      </tr>`;
    console.error("Error loading employee data:", error);
  }

  try {
       remove_loading_shimmer();
   
  } catch (error) {
    console.log(error);
  }
}


objects_data_handler_function(all_data_load_dashboard);

window.editStatusById = async function editStatusById(id, event) {
  const element = event.target;
  let updatedStatus = element.checked ? "Active" : "In-Active";

  try {
    const response = await fetch(ROLE_UPDATE_API , {
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

//-------------------------------------------------------------------------
let employee
async function loadEmployeeList() {
  try {
    const response = await fetch(USER_GETALL_API, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          Authorization: token,
      },
  }); 
 
  const res = await response.json();

employee = res.data
console.log('this is my data: ',employee)
    const dropdown = document.getElementById('employeeDropdown');
    employee.forEach((employee) => {
      const option = document.createElement('option');
      option.value = employee._id; 
      option.textContent = `${employee.first_name} ${employee.last_name}  (${employee.userId})`;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading employee list:', error);
  }
}

// Call the function to populate the dropdown on page load
loadEmployeeList();

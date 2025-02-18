if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
import { BATCH_Category_GET_API,STUDENT_UPDATE_API  ,BATCH_Category_UPDATE_API,SEARCH_API} from './global/apis.js';
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
import { individual_delete, objects_data_handler_function } from "./global/delete.js";
import { showTotalEntries, getParameters, paginationDataHandler } from "./global/pagination.js";
import { checkbox_function } from './global/multi_checkbox.js';

window.individual_delete = individual_delete;

const token = localStorage.getItem('token');
let id = new URLSearchParams(window.location.search).get('id');

//Get All API to show the data

function renderTable(data) {
  const tbody = document.getElementById("student-list-table-data");

  if (!tbody) {
      console.error("Table body not found.");
      return;
  }

  // Clear the table before rendering new data
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='7' class='text-center'>No data found.</td></tr>";
      return;
  }

  let rows = "";

  try {
      data.forEach((e , index) => {
 
          const first_name = e.first_name || "";
          const last_name = e.last_name || "";
          const fullName = (first_name + " " + last_name).trim();

          rows += `
          <tr data-id="${e?._id || "-"}">
              <td><input type="checkbox" class="checkbox_child" value="${e?._id || "-"}"></td>
              
              <td>
                  <div class="flex-align gap-8">
                      <span class="h6 mb-0 fw-medium text-gray-300">${fullName}</span>
                  </div>
              </td>
              <td><span class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill">${e.email || ''}</span></td>
              <td><span class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill">${e.application_number || '-'}</span></td>
              <td><span class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill">${e.apply_for || '-'}</span></td>
              <td><span class="h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill">${e.createdAt ? e.createdAt.split(' ')[0] : '-'}</span></td>
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
  } catch (error) {
      rows = `<tr><td colspan="7" class="text-center">Got error, please try again later!</td></tr>`;
      console.error("Data processing error:", error);
  }

  tbody.innerHTML = rows;
  checkbox_function();
  showTotalEntries(data.length, Math.ceil(data.length / 10)); // Adjust pagination dynamically

  try {
      remove_loading_shimmer();
  } catch (error) {
      console.log(error);
  }
}

async function fetchstudent() {
  try {
      const searchQuery = document.getElementById("student-search").value.trim();

      if (!searchQuery) {
          all_data_load_dashboard(); // Reload full data if search is empty
          return;
      }

      const payload = {
          modelName: "Student",
          search: searchQuery,
          roles: ["Students", "Admin", "Instructor"],
      };

      const response = await fetch(SEARCH_API, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,  // Ensure TOKEN is properly formatted
          },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch students.");
      }

      const result = await response.json();
      renderTable(result.data); // Update table with search results
  } catch (error) {
      console.error("Error fetching students:", error.message);
  }
}

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

      const response = await fetch(API, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`, // Fixed token usage
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
      const totalCount = res?.pagination?.totalCount || 0;
      const totalPages = res?.pagination?.totalPages || 1;

      if (students.length > 0) {
          renderTable(students); // Corrected function call
      } else {
          tableData.innerHTML = `
              <tr>
                  <td colspan="9" class='text-center'><i class="fa-solid fa-times"></i> No Students Found</td>
              </tr>`;
      }

      checkbox_function();
      showTotalEntries(totalCount, totalPages);

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


// Add event listener for search input
document.getElementById("student-search").addEventListener("input", fetchstudent);

 
// **Function to load batch details**


objects_data_handler_function(all_data_load_dashboard);
 
paginationDataHandler(all_data_load_dashboard);

all_data_load_dashboard();

window.editStatusById = async function editStatusById(id, event) {
    const element = event.target;
    let updatedStatus = element.checked ? "Active" : "In-Active";
  
    try {
      const response = await fetch(STUDENT_UPDATE_API, {
        method: "POST", //   Use PATCH instead of POST for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          _id: id,
          userStatus: updatedStatus
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
  
 


//getting the student id
let studentId;
window.getIdForDeletion = function getIdForDeletion(id){
    studentId=id
}

let deleteStudent = document.getElementById('deleteButton')
deleteStudent.addEventListener('click',async(event)=>{
    event.preventDefault();
    let batchIdForDeletion = id;
    let deleteStudentId = studentId;
    try {
        loading_shimmer()
    } catch (error) {
        console.log(error)
    }
    try {
        const response = await fetch(BATCH_Category_UPDATE_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            batchIdForDeletion,
            deleteStudentId
          }),
        });
    
        const result = await response.json();
        // console.log("Update status response:", result);
    //--------------------------------------------------------------------------
        try{
            remove_loading_shimmer()
            window.location.reload()
          status_popup(result?.message, (response?.ok));
        } catch(error){console.log(error)}
    //---------------------------------------------------------------------------
      } catch (error) {
        console.error("Error while deleting:", error);
      }
})





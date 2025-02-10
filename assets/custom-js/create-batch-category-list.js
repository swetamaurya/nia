import {
    BATCH_Category_CREATE_API,
    BATCH_Category_GETALL_API,
    BATCH_Category_GET_API,
    BATCH_Category_UPDATE_API,
    STUDENT_GETALL_API,
  } from "./global/apis.js";
  import {
    loading_shimmer,
    remove_loading_shimmer,
  } from "./global/loading_shimmer.js";
  import { status_popup } from "./global/status_popup.js";
  import {
    individual_delete,
    objects_data_handler_function,
  } from "./global/delete.js";
  
  import {
    showTotalEntries,
    getParameters,
    paginationDataHandler,
  } from "./global/pagination.js";
  
  import { checkbox_function } from "./global/multi_checkbox.js";
  // // For "individual_delete" if your code uses it
  window.individual_delete = individual_delete;
  const token = localStorage.getItem("token");
  
  // ==============================================================================
  // Dropdown for Course
  // Fetch student data and populate multi-select dropdown
  async function fetchAndRenderStudents() {
      const API_ENDPOINT = STUDENT_GETALL_API; // Replace with your API endpoint
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Add your authorization token here
          },
        });
    
        const apiData = await response.json();
        // console.log("Fetched Students:", apiData);
    
        const searchInputElement = document.getElementById("searchStudentInputs");
        const studentListElement = document.getElementById("studentSelectList");
        const selectedStudentsContainer = document.querySelector(
          ".selected-items-container"
        );
        const selectedStudentsInputElement = document.getElementById(
          "multiSelectedStudents"
        );
    
        if (
          !searchInputElement ||
          !studentListElement ||
          !selectedStudentsContainer ||
          !selectedStudentsInputElement
        ) {
          console.error("Required HTML elements not found!");
          return;
        }
    
        const selectedStudents = new Map(); // Store selected students by their IDs
    
        // Render students based on the provided data
        function renderStudentList(studentData) {
          studentListElement.innerHTML = ""; // Clear the existing list
          if (studentData.length === 0) {
            studentListElement.innerHTML =
              "<p class='text-muted'>No students found</p>";
          } else {
            studentData.forEach((student) => {
              const isChecked = selectedStudents.has(student._id); // Check if the student is already selected
              const studentLabel = document.createElement("label");
              studentLabel.className = "d-block mb-5";
              studentLabel.innerHTML = `
                <input type="checkbox" class="student-checkbox" value="${
                  student._id
                }" data-name="${student.first_name} ${
                student.last_name || ""
              } (${
                student.registration_number || ""
              })" ${isChecked ? "checked" : ""}>
                ${student.first_name || ""} ${student.last_name || ""} (${
                student.registration_number || ""
              })
              `;
              studentListElement.appendChild(studentLabel);
            });
          }
          studentListElement.style.display =
            studentData.length > 0 ? "block" : "none"; // Show only if results exist
        }
    
        // Handle selected students
        function updateSelectedStudentList() {
          const selectedCheckboxes = document.querySelectorAll(
            ".student-checkbox:checked"
          );
    
          // Add checked students to the selected list
          selectedCheckboxes.forEach((checkbox) => {
            const studentId = checkbox.value;
            const studentName = checkbox.getAttribute("data-name");
            selectedStudents.set(studentId, studentName);
          });
    
          // Remove unchecked students from the selected list
          const uncheckedCheckboxes = document.querySelectorAll(
            ".student-checkbox:not(:checked)"
          );
    
          uncheckedCheckboxes.forEach((checkbox) => {
            const studentId = checkbox.value;
            selectedStudents.delete(studentId);
          });
    
          // Update the selected names in the input and container
          const selectedNames = Array.from(selectedStudents.values());
    
          if (selectedNames.length > 0) {
            selectedStudentsInputElement.value = selectedNames.join(", ");
            selectedStudentsContainer.style.display = "block"; // Show the div
          } else {
            selectedStudentsContainer.style.display = "none"; // Hide the div if no students are selected
          }
        }
    
        // Attach event listener to dynamically generated checkboxes
        studentListElement.addEventListener("change", function (e) {
          if (e.target.classList.contains("student-checkbox")) {
            updateSelectedStudentList();
          }
        });
    
        // Search functionality
        searchInputElement.addEventListener("input", function () {
          const searchTerm = this.value.toLowerCase();
          if (searchTerm) {
            const filteredStudentList = apiData?.students.filter((student) => {
              const fullName = `${student.first_name} ${
                student.last_name || ""
              } (${
                student.registration_number || ""
              })
              `.toLowerCase();
              return fullName.includes(searchTerm);
            });
            renderStudentList(filteredStudentList);
          } else {
            renderStudentList(apiData?.students || []); // Render the full list if search is empty
          }
        });
    
        // Initial rendering of students
        renderStudentList(apiData?.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
    
    
  
  async function dropdownCoursesList() {
    const API = BATCH_Category_GETALL_API;
    try {
      const response = await fetch(API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const res = await response.json();
      // console.log("Fetched Data:", res.data);
      const checkboxContainer = document.getElementById("checkboxContainer");
  
      // Clear any previous content
      checkboxContainer.innerHTML = "";
  
      if (res?.data && res.data.length > 0) {
        res.data.forEach((course) => {
          const checkboxDiv = document.createElement("div");
          checkboxDiv.className = "form-check mb-2";
  
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "form-check-input";
          checkbox.id = `checkbox_${course._id}`;
          checkbox.value = course.createList; // Assuming createList contains the course name
  
          const label = document.createElement("label");
          label.className = "form-check-label";
          label.htmlFor = `checkbox_${course._id}`;
          label.textContent = course?.createList;
  
          // Add change event to handle selection
          checkbox.addEventListener("change", updateSelectedList);
  
          checkboxDiv.appendChild(checkbox);
          checkboxDiv.appendChild(label);
          checkboxContainer.appendChild(checkboxDiv);
        });
      } else {
        checkboxContainer.innerHTML = "<p>No items found.</p>";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      document.getElementById("checkboxContainer").innerHTML =
        "<p>Error loading items.</p>";
    }
  }
  
  // Function to update the selected list input field
  function updateSelectedList() {
    const selectedBatches = [];
    const checkboxes = document.querySelectorAll(
      "#checkboxContainer .form-check-input"
    );
  
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedBatches.push(checkbox.value);
      }
    });
  
    const selectedBatchInput = document.getElementById("multiSelectedBatch");
    selectedBatchInput.value = selectedBatches.join(", ");
  
    // Show or hide the selected items container based on selection
    const selectedItemsContainer = document.querySelector(
      ".selected-items-container"
    );
    if (selectedBatches.length > 0) {
      selectedItemsContainer.style.display = "block";
    } else {
      selectedItemsContainer.style.display = "none";
    }
  }
  
  // Function to toggle dropdown visibility
  function toggleDropdown() {
    const checkboxContainer = document.getElementById("checkboxContainer");
    checkboxContainer.style.display =
      checkboxContainer.style.display === "none" ? "block" : "none";
  }
  
  // Close dropdown when clicking outside (optional)
  function closeDropdownOnOutsideClick(event) {
    const dropdownMenu = document.getElementById("checkboxContainer");
    const dropdownToggle = document.getElementById("dropdownToggle");
    if (
      dropdownMenu.style.display === "block" &&
      !dropdownMenu.contains(event.target) &&
      !dropdownToggle.contains(event.target)
    ) {
      dropdownMenu.style.display = "none";
    }
  }
  
  // Attach event listeners
  document
    .getElementById("dropdownToggle")
    .addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdownOnOutsideClick);
  
  // Populate the dropdown list
  dropdownCoursesList();
  
  async function dropdownStudentList() {
      const API = STUDENT_GETALL_API; // Replace with your API endpoint
      try {
        const response = await fetch(API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Add your authorization token here
          },
        });
    
        const res = await response.json();
        // console.log("Fetched Students:", res);
    
        const searchInput = document.getElementById("searchInput");
        const studentList = document.getElementById("studentList");
        const selectedStudentsDiv = document.querySelector(".selected-students");
        const selectedStudentsInput = document.getElementById("selectedStudents");
    
        if (
          !searchInput ||
          !studentList ||
          !selectedStudentsDiv ||
          !selectedStudentsInput
        ) {
          console.error("Required HTML elements not found!");
          return;
        }
    
        const selectedStudents = new Map(); // To store selected students with their IDs as keys
    
        // Render students in the dropdown
        function renderStudents(studentData) {
          studentList.innerHTML = ""; // Clear the existing list
          if (studentData.length === 0) {
            studentList.innerHTML = "<p class='text-muted'>No students found</p>";
          } else {
            studentData.forEach((student) => {
              const isChecked = selectedStudents.has(student._id);
              const option = document.createElement("label");
              option.className = "d-block mb-5";
              option.innerHTML = `
                            <input type="checkbox" class="student-checkboxs" value="${
                              student._id
                            }" data-name="${student.first_name} ${
                student.last_name || ""
              }" (${
                student.registration_number || ""
              })
              ${isChecked ? "checked" : ""}>
                            ${student.first_name || ""} ${student.last_name || ""} (${
                student.registration_number || ""
              })
                        `;
              studentList.appendChild(option);
            });
          }
          studentList.style.display = studentData.length > 0 ? "block" : "none"; // Show only if results exist
        }
    
        // Handle selected students
        function updateSelectedStudents() {
          const selectedCheckboxes = document.querySelectorAll(
            ".student-checkboxs:checked"
          );
    
          selectedCheckboxes.forEach((checkbox) => {
            const studentId = checkbox.value;
            const studentName = checkbox.getAttribute("data-name");
            selectedStudents.set(studentId, studentName);
          });
    
          const uncheckedCheckboxes = document.querySelectorAll(
            ".student-checkboxs:not(:checked)"
          );
    
          uncheckedCheckboxes.forEach((checkbox) => {
            const studentId = checkbox.value;
            selectedStudents.delete(studentId);
          });
    
          const selectedNames = Array.from(selectedStudents.values());
    
          if (selectedNames.length > 0) {
            selectedStudentsInput.value = selectedNames.join(", ");
            selectedStudentsDiv.style.display = "block"; // Show the div
          } else {
            selectedStudentsDiv.style.display = "none"; // Hide the div if no students are selected
          }
        }
    
        // Attach event listener to dynamically generated checkboxes
        studentList.addEventListener("change", function (e) {
          if (e.target.classList.contains("student-checkboxs")) {
            updateSelectedStudents();
          }
        });
    
        // Search functionality
        searchInput.addEventListener("input", function () {
          const searchTerm = this.value.toLowerCase();
          if (searchTerm) {
            const filteredStudents = res?.students.filter((student) => {
              const fullName = `${student.first_name} ${
                student.last_name || ""
              } (${
                student.registration_number || ""
              })
              `.toLowerCase();
              return fullName.includes(searchTerm);
            });
            renderStudents(filteredStudents);
          } else {
            studentList.style.display = "none"; // Hide the list if search is empty
          }
        });
    
        // Initial rendering of students
        renderStudents(res?.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
    
  
  dropdownCoursesList();
  fetchAndRenderStudents();
  dropdownStudentList();
  
  // ==============================================================================
  // Add Batch Form Function
  async function addBatchForm(event) {
    event.preventDefault();
  
    const createList = document.getElementById("createList")?.value; // Ensure correct ID
  
    // Get all selected students from the multi-select dropdown
    const selectedStudents = [];
    document
      .querySelectorAll('#dropdownMenu input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        selectedStudents.push(checkbox.value);
      });
  
    // if (!createList || selectedStudents.length === 0) {
    //     status_popup("Please fill all required fields", false);
    //     return;
    // }
  
    // console.log(selectedStudents);
    try {
      loading_shimmer();
    } catch (error) {
      console.log(error);
    }
  
    try {
      const API = BATCH_Category_CREATE_API;
  
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ createList, student: selectedStudents }), // Send as array
      });
  
      const result = await response.json();
      // console.log("Batch Creation Response:", result);
  
      status_popup(result?.message, response.ok);
  
      if (response.ok) {
        setTimeout(() => {
          window.location.href = "create-batch-category-list.html";
        }, 1000);
      }
    } catch (error) {
      status_popup("Batch could not be created", false);
      console.log(error);
    } finally {
      remove_loading_shimmer();
    }
  }
  
  // ==============================================================================
  // Reset Function
  
  // ==============================================================================
  // Attach event listeners after DOM is fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    // console.log("DOM fully loaded"); // Debugging check
  
    // Get the Submit button
    const submitButton = document.getElementById("submit");
    // console.log("Submit Button:", submitButton); // Debugging check
  
    if (submitButton) {
      submitButton.addEventListener("click", (event) => {
        // console.log("Submit button clicked"); // Debugging check
        addBatchForm(event);
      });
    } else {
      console.error("Submit button not found!");
    }
  });


  // ==============================================================================
  // Add Batch Form Function
//  Function to handle batch selection and student selection
async function multipleBatchForm(event) {
  event.preventDefault();

  //  Get all selected batch IDs
  const selectedBatches = [];
  document
    .querySelectorAll('#checkboxContainer input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedBatches.push(checkbox.value);
    });

  //  Get all selected student IDs
  const selectedStudents = [];
  document
    .querySelectorAll('#studentSelectList input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedStudents.push(checkbox.value);
    });

  console.log("🚀 Selected Batches:", selectedBatches);
  console.log("🚀 Selected Students:", selectedStudents);

  if (selectedBatches.length === 0 || selectedStudents.length === 0) {
    alert("Please select at least one batch and one student.");
    return;
  }

 

  try {
    loading_shimmer();
  } catch (error) {
    console.log(" Error showing shimmer:", error);
  }

  try {
    const API = BATCH_Category_UPDATE_API; //  Correct API for updating existing batches

    const response = await fetch(API, {
      method: "POST", //  PATCH is correct for updates
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        batchIds: selectedBatches, //  Send selected batches as an array
        students: selectedStudents, //  Send selected students as an array
      }),
    });

    const result = await response.json();
    console.log(" Batch Update Response:", result);

    status_popup(result?.message, response.ok);

    // if (response.ok) {
    //   setTimeout(() => {
    //     window.location.href = "create-batch-category-list.html";
    //   }, 1000);
    // }
  } catch (error) {
    status_popup(" Batch update failed", false);
    console.log(" Error updating batch:", error);
  } finally {
    remove_loading_shimmer();
  }
}

//  Attach event listener to submit button
document.addEventListener("DOMContentLoaded", () => {
  // console.log(" DOM fully loaded");

  const submitButton = document.getElementById("submit");
  if (submitButton) {
    submitButton.addEventListener("click", (event) => {
      console.log(" Submit button clicked");
      multipleBatchForm(event);
    });
  } else {
    console.error(" Submit button not found!");
  }
});





// ==============================================================================

async function all_data_load_dashboard() {
  try {
    loading_shimmer();
  } catch (error) {
    console.log(error);
  }
  // -----------------------------------------------------------------------------------

  const tableData = document.getElementById("student-list-table-data");
  tableData.innerHTML = "";
  let rows;

  try {
    const response = await fetch(
      `${BATCH_Category_GETALL_API}${getParameters()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const res = await response.json();
    // console.log("Full API Response:", res); // Debugging

    const batchs = res?.data || [];
    // console.log("Processed Batch Data:", batchs); // Debugging

    const totalCount = res?.pagination?.totalCount || 0;
    const totalPages = res?.pagination?.totalPages || 1;

    if (batchs && batchs.length > 0) {
      rows = batchs.map((e, index) => {
        return `
                    <tr data-id="${e?._id || "-"}">
                    <td><input type="checkbox" class="checkbox_child" value="${
                      e?._id || "-"
                    }"></td>
                        <td>
                            <p class="h6 mb-0 fw-medium text-gray-300">${
                              index + 1
                            }</p>
                        </td>
                        <td>
                            <span class="h6 mb-0 fw-medium text-gray-300">${
                              e.createList || "-"
                            }</span>
                        </td>
                        <td>
                            <a href="#" class="import-btn bg-main-50 text-main-600 py-2 px-14 rounded-pill hover-bg-main-600 hover-text-white" data-id="${
                              e._id
                            }">Import</a>
                            <a href="#" class="export-btn bg-main-50 text-main-600 py-2 px-14 rounded-pill hover-bg-main-600 hover-text-white" data-id="${
                              e._id
                            }">Export</a>
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
        <a href="edit-batch-category-list.html?id=${
          e._id
        }" class="edit-btn action-btn me-5" title="Edit">
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

window.editStatusById = async function editStatusById(id, event) {
  const element = event.target;
  let updatedStatus = element.checked ? "Active" : "In-Active";

  try {
    const response = await fetch(BATCH_Category_UPDATE_API, {
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

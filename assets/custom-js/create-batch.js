if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
import { BATCH_CREATE_API, COURSE_GETALL_API ,BATCH_Category_GETALL_API} from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
 import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================

//Dropdown for Course
async function loadStudentDropdown() {
    const studentDropdown = document.getElementById("studentDropdown");
  
    try {
      const response = await fetch(BATCH_Category_GETALL_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch students. HTTP Status: ${response.status}`);
      }
  
      const result = await response.json();
      const students = result?.data || [];
  
      // ✅ Clear previous options
      studentDropdown.innerHTML = `<option value="">-- Select a Student --</option>`;
  
      // ✅ Populate dropdown with student names
      students.forEach(student => {
        const option = document.createElement("option");
        option.value = student._id;
        option.textContent = `${student.createList} `;
        studentDropdown.appendChild(option);
      });
  
    } catch (error) {
      console.error("Error fetching students:", error);
      studentDropdown.innerHTML = `<option value="">Failed to load students</option>`;
    }
  }
  
  //  Call function when the page loads
document.addEventListener("DOMContentLoaded", loadStudentDropdown);
  

//Add Batch Form
// Add event listeners to calculate total days dynamically
document.getElementById('fromDate').addEventListener('change', calculateTotalDays);
document.getElementById('toDate').addEventListener('change', calculateTotalDays);

function calculateTotalDays() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const totalDaysInput = document.getElementById('batchTotalDays');

    if (fromDate && toDate) {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const timeDifference = end - start;
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1; // Including the start date

        if (daysDifference > 0) {
            totalDaysInput.value = daysDifference;
        } else {
            totalDaysInput.value = 0; // Reset if invalid range
        }
    } else {
        totalDaysInput.value = "";
    }
}

// Disable the totalDays input field
document.getElementById('batchTotalDays').setAttribute('readonly', true);
// Function to auto-update batch title
 

  
// Add Batch Form Function
async function addBatchForm(event) {
    event.preventDefault();
    
    const batchTitle = document.getElementById('BatchTitle').value;
    const batchYear = document.getElementById('batchYear').value;
    const durationFrom = document.getElementById('fromDate').value;
    const durationTo = document.getElementById('toDate').value;
    const totalDays = document.getElementById('batchTotalDays').value;
    const batchCategory = document.getElementById('studentDropdown').value;
    
    try {
        loading_shimmer();
    } catch (error) {
        console.log(error);
    }

    try {
        const API = `${BATCH_CREATE_API}`;

        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ batchTitle, batchYear, durationFrom, durationTo, totalDays, batchCategory })
        });

        const r1 = await response.json();
        console.log('THIS IS MY RESPONSE: ', r1);

         // Show the status message
         try {
            status_popup(r1?.message, response?.ok);
        } catch (error) {
            console.log(error);
        }

        // Redirect only if the response is successful
        if (response.ok) {
            setTimeout(() => {
                window.location.href = 'batch-list.html';
            }, 1000);
        }
    } catch (error) {
        status_popup("Batch is not created", false);
        console.log(error);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.log(error);
    }
}


document.getElementById('submit').addEventListener('click',(event)=>{addBatchForm(event)})
document.getElementById('cancel').addEventListener('click',(event)=>{resetBatchForm(event)});
import { COURSE_GETALL_API, BATCH_GET_API, BATCH_UPDATE_API, BATCH_Category_GETALL_API } from './global/apis.js';
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";

const token = localStorage.getItem('token');
let id = new URLSearchParams(window.location.search).get('id');

//==============================================================================
async function loadStudentDropdown(selectedStudentId = null) {
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
        studentDropdown.innerHTML = `<option value="">-- Select a Batch Student --</option>`;

        // ✅ Populate dropdown with student names
        students.forEach(student => {
            const option = document.createElement("option");
            option.value = student._id;
            option.textContent = student.createList;

            // ✅ Set selected if student is associated with batch
            if (selectedStudentId && student._id === selectedStudentId) {
                option.selected = true;
            }

            studentDropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Error fetching students:", error);
        studentDropdown.innerHTML = `<option value="">Failed to load students</option>`;
    }
}

// ✅ Load dropdown on page load
document.addEventListener("DOMContentLoaded", () => {
    loadStudentDropdown();
});

//===============================================================================
window.editLoadData = async function editLoadData() {
    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }

    const batchTitle = document.getElementById('BatchTitle');
    const batchYear = document.getElementById('batchYear');
    const durationFrom = document.getElementById('fromDate');
    const durationTo = document.getElementById('toDate');
    const totalDays = document.getElementById('batchTotalDays');
    const studentDropdown = document.getElementById('studentDropdown');

    try {
        const API = `${BATCH_GET_API}?_id=${id}`;
        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data.");
        }

        const res = await response.json();
        let batch = res.batch || {};

        batchTitle.value = batch.batchTitle || '';
        batchYear.value = batch.batchYear || '';
        durationFrom.value = batch.durationFrom || '';
        durationTo.value = batch.durationTo || '';
        totalDays.value = batch.totalDays || '';

        // ✅ Extract `createList` from `batchCategory` array
        let batchCategory = batch.batchCategory?.length > 0 ? batch.batchCategory[0] : null;

        if (batchCategory) {
            let selectedStudentId = batchCategory._id; // ✅ Get batch category ID

            // ✅ Populate dropdown AFTER fetching batch details
            loadStudentDropdown(selectedStudentId);

            // ✅ Set selected option if batchCategory exists
            let options = studentDropdown.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === batchCategory._id) {
                    options[i].selected = true;
                    break;
                }
            }
        } else {
            console.warn("No batchCategory found.");
        }

    } catch (error) {
        console.error("Error fetching batch data:", error);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error("Error removing shimmer:", error);
    }
};

// ✅ Load batch details on page load
editLoadData();


//===============================================================================
// ✅ Calculate Total Days Between Two Dates
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
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;

        totalDaysInput.value = daysDifference > 0 ? daysDifference : 0;
    } else {
        totalDaysInput.value = "";
    }
}

// Disable manual editing of `totalDays`
document.getElementById('batchTotalDays').setAttribute('readonly', true);

//===============================================================================
// ✅ Submit Batch Form (Edit)
async function editBatchForm(event) {
    event.preventDefault();

    const batchTitle = document.getElementById('BatchTitle').value;
    const batchYear = document.getElementById('batchYear').value;
    const durationFrom = document.getElementById('fromDate').value;
    const durationTo = document.getElementById('toDate').value;
    const totalDays = document.getElementById('batchTotalDays').value;
    const batchCategory = document.getElementById('studentDropdown').value;
    const _id = id;

    try {
        loading_shimmer();
    } catch (error) {
        console.log(error);
    }

    try {
        const API = `${BATCH_UPDATE_API}`;
        const response = await fetch(API, {
            method: 'POST', // ✅ Changed from POST to PATCH (for updates)
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ batchTitle, batchYear, durationFrom, durationTo, totalDays, batchCategory, _id })
        });

        const r1 = await response.json();
        console.log('Batch Update Response:', r1);

        try {
            status_popup(r1?.message, response.ok);
        } catch (error) {
            console.log(error);
        }

        if (response.ok) {
            setTimeout(() => {
                window.location.href = 'batch-list.html';
            }, 1000);
        }
    } catch (error) {
        status_popup("Batch update failed", false);
        console.log(error);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.log(error);
    }
}

// ✅ Reset Form
function resetBatchForm(event) {
    event.preventDefault();
    document.getElementById('BatchTitle').value = '';
    document.getElementById('batchYear').value = '';
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
    document.getElementById('batchTotalDays').value = '';
    document.getElementById('studentDropdown').selectedIndex = 0;
}

// ✅ Attach Event Listeners
document.getElementById('submit').addEventListener('click', editBatchForm);
document.getElementById('cancel').addEventListener('click', resetBatchForm);

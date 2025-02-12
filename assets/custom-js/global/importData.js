// (function(){
//     const timestamp = localStorage.getItem('timestampActiveSession');
//     if (timestamp) {
//         const currentTime = Date.now();
//         const timeDiff = currentTime - parseInt(timestamp);
//         let hrs = 9.5; // hrs session active condition
//         if (timeDiff > hrs * 60 * 60 * 1000) {
//             localStorage.clear();
//             window.location.href = 'login.html';
//         }
//     } else {
//         localStorage.clear();
//         window.location.href = 'login.html';
//     }
// })();
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
import { TOKEN, import_API } from './apis.js';
import { status_popup } from './status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './loading_shimmer.js';

// Ensure the script runs only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("import_excel_file_form");
    const fileInput = document.getElementById("fileInputImport");

    if (!form) {
        console.error("Form element not found. Check if the ID is correct.");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("Form Submitted!");

        try {
            loading_shimmer();
        } catch (error) {
            console.error("Loading shimmer error:", error);
        }

        try {
            document.querySelectorAll(".btn-close").forEach(e => e.click());
        } catch (error) {
            console.error("Close button error:", error);
        }

        try {
            const formData = new FormData();
            let file = fileInput.files[0];

            // Validate file selection
            if (!file) {
                status_popup("Please select a file before submitting.", false);
                remove_loading_shimmer();
                return;
            }

            formData.append("file", file);
            formData.append("role", form.getAttribute("modeltype") || "defaultRole");

            console.log("Submitting file:", file.name);

            const response = await fetch(import_API, {
                method: 'POST',
                headers: {
                    'Authorization': `${TOKEN}`, // Do not set Content-Type, FormData does it automatically
                },
                body: formData,
            });

            console.log("Response Status:", response.status); // Debugging

            let responseData;
            try {
                responseData = await response.json();
            } catch (jsonError) {
                throw new Error("Invalid JSON response from server");
            }

            console.log("Server Response:", responseData); // Debugging

            // Display success or error message
            status_popup(responseData?.message || "Unknown error occurred", response.ok);

            if (response.ok) {
                forGloablDelete_js();
            } else {
                console.error("Import Error:", responseData);
            }
        } catch (error) {
            console.error("Error importing data:", error);
            status_popup("Error importing data. Please try again.", false);
        }

        try {
            remove_loading_shimmer();
        } catch (error) {
            console.error("Remove shimmer error:", error);
        }
    });
});



// document.addEventListener("DOMContentLoaded", () => {
//     const dropZone = document.getElementById("dropZone");
//     const fileInput = document.getElementById("fileInputImport");

//     // Open file dialog when clicking on the drag-drop zone
//     dropZone.addEventListener("click", () => {
//         fileInput.click();
//     });

//     // Handle file input change
//     fileInput.addEventListener("change", (event) => {
//         handleFiles(event.target.files);
//     });

//     // Drag over event
//     dropZone.addEventListener("dragover", (event) => {
//         event.preventDefault();
//         dropZone.classList.add("drag-over");
//     });

//     // Drag leave event
//     dropZone.addEventListener("dragleave", () => {
//         dropZone.classList.remove("drag-over");
//     });

//     // Drop event
//     dropZone.addEventListener("drop", (event) => {
//         event.preventDefault();
//         dropZone.classList.remove("drag-over");
//         const files = event.dataTransfer.files;

//         // Update the file input's files property
//         const dataTransfer = new DataTransfer(); // Create a new DataTransfer object
//         for (const file of files) {
//             dataTransfer.items.add(file); // Add each file to the DataTransfer object
//         }
//         fileInput.files = dataTransfer.files; // Set the files to the file input

//         handleFiles(files);
//     });

//     // Handle file processing
//     function handleFiles(files) {
//         try {
//             dropZone.querySelector("p").innerText = files[0].name; // Display the file name in the drop zone
//         } catch (error) {
//             console.log(error);
//         }
//         console.log("Files selected or dropped:", files);
//         // Implement further processing of files here
//     }
// });


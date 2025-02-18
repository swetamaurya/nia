if (!localStorage.getItem("token")) {
    localStorage.removeItem("token");
    window.location.href = 'sign-in.html';
}

import { COURSE_GETALL_API, RESOURCES_GETALL_API } from './global/apis.js';
import { showTotalEntries, getParameters, paginationDataHandler } from './global/pagination.js';
import { objects_data_handler_function } from "./global/delete_div.js";
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";

const token = localStorage.getItem('token');

async function all_data_load_list() {
    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }

    try {
        const coursesData = document.getElementById('courses');
                let API = `${RESOURCES_GETALL_API}${getParameters()}`;
        
 
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

        const r1 = await response.json();
        let totalCount = r1?.pagination?.totalCount || 0;
        let totalPages = r1?.pagination?.totalPages || 1;

        const course = r1.data || [];

        // Clear previous data before appending new data
        coursesData.innerHTML = '';

        if (course.length > 0) {
            course.forEach((e) => {
                let image = e.gallery?.length > 0 ? e.gallery.length : 0;
                let file = e.materials?.length > 0 ? e.materials.length : 0;
                let totalFiles = image + file;

                if (totalFiles !== 0) {
                    coursesData.innerHTML += `
                        <div class="resource-item">
                            <div class="form-check">
                                <input class="form-check-input border-gray-200 rounded-4" type="checkbox">
                            </div>
                            <label>
                                <a href='course-details.html?id=${e._id}'>
                                    <span class="d-block mb-16">
                                        <img src="assets/images/icons/file-icon1.png" alt="">
                                    </span>
                                </a>
                                <span class="d-block text-gray-400 text-15">${e.title}</span>
                                <span class="d-block text-gray-200 text-15">${totalFiles} Files</span>
                            </label>
                        </div>`;
                }
            });
        } else {
            coursesData.innerHTML = `
                <div class="resource-item">
                    <div class="form-check">
                        <input class="form-check-input border-gray-200 rounded-4" type="checkbox">
                    </div>
                    <label>
                        <span class="d-block mb-16">
                            <img src="assets/images/icons/file-icon1.png" alt="">
                        </span>
                        <span class="d-block text-gray-400 text-15">No files available.</span>
                    </label>
                </div>`;
        }

        showTotalEntries(totalCount, totalPages);
    } catch (error) {
        console.error("Error in all_data_load_list:", error.message);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    }
}

// Initialize pagination & event handlers
objects_data_handler_function(all_data_load_list);
paginationDataHandler(all_data_load_list);
all_data_load_list();

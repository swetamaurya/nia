if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
import { COURSE_GETALL_API , RESOURCES_GETALL_API } from './global/apis.js'
import { showTotalEntries,getParameters,paginationDataHandler } from './global/pagination.js'
import {
    objects_data_handler_function,
  } from "./global/delete_div.js"; 
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================
//===============================================================================
//Get All API to show the data

async function all_data_load_list() {
    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }

    try {
        const coursesData = document.getElementById('courses')
        const API = `${RESOURCES_GETALL_API}${getParameters()}`;

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
        debugger;
        let totalCourses = r1?.pagination?.totalCourses;
        let totalPages = r1?.pagination?.totalPages;
        const course = r1.data
        if(course.length > 0){
            course.map((e,i)=>{
                let image = e.gallery.length > 0 ? e.gallery.length : 0
                let file = e.materials.length > 0 ? e.materials.length : 0
                let totalFiles = image+file
                if(totalFiles!=0){
                coursesData.innerHTML+=`
                <div class="resource-item">
                    <div class="form-check">
                      <input class="form-check-input border-gray-200 rounded-4" id="checkbox1" type="checkbox">
                    </div>
                    <label for="checkbox1" class="">
                      <a href='course-details.html?id=${e._id}'><span class="d-block mb-16"><img src="assets/images/icons/file-icon1.png" alt=""></span></a>
                      <span class="d-block text-gray-400 text-15">${e.title}</span>
                      <span class="d-block text-gray-200 text-15">${totalFiles} Files</span>
                    </label>
                </div>`
                }
            })
        }
        else{
            coursesData.innerHTML+=`
                <div class="resource-item">
                    <div class="form-check">
                      <input class="form-check-input border-gray-200 rounded-4" id="checkbox1" type="checkbox">
                    </div>
                    <label for="checkbox1" class="">
                      <span class="d-block mb-16"><img src="assets/images/icons/file-icon1.png" alt=""></span>
                      <span class="d-block text-gray-400 text-15">No files is there..</span>
                    </label>
                </div>`
        }
        showTotalEntries(totalCourses,totalPages)
    } catch (error) {
        console.error("Error in all_data_load_list:", error.message);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    }
}
objects_data_handler_function(all_data_load_list)
paginationDataHandler(all_data_load_list)
// all_data_load_list()



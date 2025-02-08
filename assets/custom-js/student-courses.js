import { COURSE_GETALL_API } from './global/apis.js'
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
        let coursesCards = document.getElementById("courses-cards");
        coursesCards.innerHTML = '';
        let cards = "";
        const API = `${COURSE_GETALL_API}`;

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
        let statusCardBgColor;
        console.log('THIS IS MY DATA: ',r1);
        const data = r1?.courses;
        let totalCourses = r1?.pagination?.totalCourses;

        // setTotalDataCount(totalCourses);
        if (totalCourses > 0) {
            try {
                data.forEach((e, i) => {
                    const thumbnail  = e.thumbnail || "assets/images/thumbs/course-img1.png";

                    e.statusOfCards === 'Draft'? statusCardBgColor='bg-danger' : statusCardBgColor='bg-primary'
                   
                    cards += `
                          <div class="col-xxl-3 col-lg-4 col-sm-6">
                              <div class="card border border-gray-100">
                                  <div class="card-body p-8">
                                      <a href="course-details.html"
                                          class="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center">
                                          <img src="${thumbnail}" alt="" >
                                      </a>
                                      <div class="p-8">
                                          <!-- <span class="text-13 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 mb-16">Design</span> -->
                                          <h5 class="mb-4 text-truncate"><a href="course-details.html"
                                                  class="hover-text-main-600">${e.title ? e.title : '-'}</a></h5><span
                                              class="badge ${statusCardBgColor} position-absolute "
                                              style="top: 9px;right: 8px;">${e.statusOfCards}</span>
                                              <span
                                              class="badge bg-secondary position-absolute "
                                              style="top: 9px;left: 9px;">${e.createdAt.split(' ')[0]}</span>
                                          <p class="three-line-text-truncate">${e.description}</p>
                                          <div class="flex-align gap-8 flex-wrap mt-16">
                                              <img src="assets/images/thumbs/user-img5.png"
                                                  class="w-28 h-28 rounded-circle object-fit-cover" alt="User Image">
                                              <div>
                                                  <span class="text-gray-600 text-13">Created by <a href="profile.html"
                                                          class="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline">${e.createdBy}</a> </span>
                                              </div>
                                          </div>
  
  
  
                                         
                                      </div>
                                  </div>
                                   <div  class="btn--container d-flex justify-content-around course-list">
                                           <a href="course-details.html?id=${e._id}" class="action-btn me-5" title="Edit">
                        <i class="ph ph-eye me-3"></i> View
                      </a>
                      <a href="edit-course.html?id=${e._id}" class="action-btn me-5" title="Edit">
                        <i class="ph ph-pencil me-3"></i> Edit
                      </a>
                      <a class="action-btn btn--danger btn-outline-danger form-alert" href="javascript:" data-id="role-2" data-message="Want to delete this role?">
                        <i class="ph ph-trash me-3"></i> Delete
                      </a>
                      
                    </div>
                              </div>
                          </div>`;
                  });
            } catch (error) {
                cards = `<tr><td colspan="4" class="text-center">Got error, please try again later!</td></tr>`;
                console.error("Data not found:", error);
            }
        } else {
            cards = `<div class="col-xxl-3 col-lg-4 col-sm-6">No Courses</div>`;
        }

        coursesCards.innerHTML = cards;
    } catch (error) {
        console.error("Error in all_data_load_list:", error.message);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    }
}

all_data_load_list();
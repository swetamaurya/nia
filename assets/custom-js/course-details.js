import { COURSE_GET_API, USER_UPDATE_API, ROLE_GETALL_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================
//===============================================================================
let id = new URLSearchParams(window.location.search).get('id')

//===============================================================================
window.editLoadData = async function editLoadData() {
    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }
    const title = document.getElementById('course-title')
    // const createdBy = localStorage.getItem('name');
    const description = document.getElementById('course-description')
    // const category = document.getElementById('courseCategory')
    // const duration = document.getElementById('courseDuration')
    const imageContainer = document.getElementById('image-container');
    const courseFileTbody = document.getElementById('course-file-tbody')
    const cardStatus = document.getElementById('card-status')
    const createdBy = document.getElementById('created-by');
    const createdDate = document.getElementById('created-date')
    const courseCategory = document.getElementById('course-category')
    let imageUploadDivs = document.getElementsByClassName('image-upload__boxInner')[0];
    let courseDuration = document.getElementById('course-duration')
    const profilePhoto = document.getElementById('profile-pic')
    try {
        const API = `${COURSE_GET_API}?_id=${id}`;
        console.log('This is my get API: ', API);

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
        const res = await response.json()
        const course = res.course;
        const firstName = course.instructor?.first_name || ''
        const lastName = course.instructor?.last_name || ''
        const instructorName = firstName +' '+lastName
        title.innerText = course.title
        description.innerText = course.description
        course?.status === 'Publish'?
        cardStatus.setAttribute('class','bg-success')
        :
        cardStatus.setAttribute('class','bg-danger')
        cardStatus.innerText = course.statusOfCards
        createdBy.innerText =  instructorName
        createdDate.innerText = course.createdAt.split(' ')[0]
        courseCategory.innerText = course?.category?.categoryName



        course.gallery.length > 0 ? 
        course.gallery.map((e,i)=>{
            let image = document.createElement('img');
            image.src = e;
            image.setAttribute('class','initial-24');
            imageContainer.appendChild(image);
        })
        : imageContainer.innerHTML =`
        <img class="initial-24" src="assets/images/thumbs/course-details.png"
        alt="Employee" />`

        if(course.materials.length > 0){
        course.materials.map((e,i)=>{
            courseFileTbody.innerHTML+=`
            <tr>
                <td>${i+1}</td>

                <td><a href="${e}" target="_blank">File ${i+1}</a>
                </td>
                <td >
                    <div class="btn--container d-flex ">
                        <a href="${e}" class="action-btn me-5" title="Edit">
                            <i class="ph ph-eye"></i>
                        </a>
                        <a class="action-btn btn--danger btn-outline-danger form-alert" href="javascript:" data-id="role-2" data-message="Want to delete this role?">
                            <i class="ph ph-trash"></i>
                        </a>
                        </div>
                </td>
            </tr>`
        })
        }

        // category.value = course.category
        // duration.value = course.duration
        profilePhoto.src = course?.thumbnail? course.thumbnail : 'assets/images/thumbs/course-img1.png'
        // thumbnail
        courseDuration.innerText = `: `+course.duration
        // showFiles(image)

    } catch (error) {console.log(error)}
    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    }
}
editLoadData()
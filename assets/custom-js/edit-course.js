import { COURSE_GET_API, COURSE_UPDATE_API, USER_GETALL_API, COURSE_category_GETALL_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================
//===============================================================================

//Dropdown Course Category
async function dropdownCourses() {
    const API = COURSE_category_GETALL_API
    try {
        const response = await fetch(API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
        });
        const res = await response.json();
        console.log(res);
    const courseCategory = document.getElementById("courseCategory");
    res?.categories.forEach((course) => {
        const option = document.createElement("option");
        option.value = course._id;
        option.text = `${course?.categoryName}`;
        courseCategory.appendChild(option);
      });
    }
    catch(error){
        console.error('Error fetching data:', error);
    }
}
dropdownCourses();

//Dropdown Instructor
async function dropdownInstructor(){
    let instructorList = [];
    const API = USER_GETALL_API
    try {
        const response = await fetch(API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
        });
        const res = await response.json();
        instructorList = res.data;
        const instructor = instructorList.filter((e)=>e.roles.roles === 'Instructor')
        const selectInstructor = document.getElementById("selectInstructor");
        instructor?.forEach((instructors) => {
          const option = document.createElement("option");
          option.value = instructors._id;
          option.text = `${instructors?.first_name} ${instructors?.last_name}`;
          selectInstructor.appendChild(option);
        });
    }catch(error){
        console.log(error)
    }
}

let id = new URLSearchParams(window.location.search).get('id')
let imageFiles = []; // To store the actual File objects
let updateFiles=[]

// const fileInput = document.getElementById("customFileUpload");
//         const viewer = document.getElementById("viewer");

//         // Add an event listener for file selection
//         fileInput.addEventListener("change", function () {
//             const file = fileInput.files[0]; // Get the selected file
//             if (file) {
//                 const reader = new FileReader(); // Create a FileReader to read the file
//                 reader.onload = function (e) {
//                     viewer.src = e.target.result; // Update the image's src with the file's data URL
//                 };
//                 reader.readAsDataURL(file); // Read the file as a Data URL
//             }
//         });


document.getElementById('multipleImageUpload').addEventListener('change', (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    imageFiles = [...imageFiles, ...files]; // Store the actual File objects

    files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const container = document.createElement('div');
            container.setAttribute('class', 'image-container');

            const image = document.createElement('img');
            image.src = e.target.result;
            image.setAttribute('class', 'initial-23');

            const actionIcons = document.createElement('div');
            actionIcons.setAttribute('class', 'action-icons');
            actionIcons.innerHTML = `
                <a href="${e.target.result}" class="action-btn" title="View" target="_blank">
                    <i class="ph ph-eye"></i>
                </a>
                <a class="action-btn btn--danger btn-outline-danger form-alert" href="javascript:" title="Delete">
                    <i class="ph ph-trash"></i>
                </a>
            `;

            container.appendChild(image);
            container.appendChild(actionIcons);
            // document.getElementById('image-container').insertBefore(container, imageContainer.firstChild);
        };

        reader.readAsDataURL(file);
    });
});

//Initialize Function 
function initializePage(){
    dropdownInstructor()
}
initializePage();
 
//===============================================================================
window.editLoadData = async function editLoadData() {
    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }
    const title = document.getElementById('courseTitle')
    // const createdBy = localStorage.getItem('name');
    const description = document.getElementById('description')
    let instructor = document.getElementById('selectInstructor')
    const category = document.getElementById('courseCategory')
    const duration = document.getElementById('courseDuration')
    const thumbnails = document.getElementById('viewer')
    const imageContainer = document.getElementById('image-container');
    const imageUploadInput = document.getElementById('multipleImageUpload');
    const courseFileTbody = document.getElementById('course-file-tbody');
    const fileInput = document.getElementById("multipleFileUpload");
    // let imageUploadDivs = document.getElementsByClassName('image-upload__boxInner')[0];
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
        console.log('nvdsndsvjnd: ',course)
        title.value = course.title
        description.value = course.description
        category.value = course.category._id
        duration.value = course.duration
        setTimeout(()=>{
            instructor.value = course.instructor._id
        },500)
        thumbnails.src = course?.thumbnail || 'assets/images/thumbs/upload-image.png';
        // Function to handle file uploads
        imageUploadInput.addEventListener('change', (event) => {
            const files = event.target.files;
        
            // Loop through each selected file
            Array.from(files).forEach((file,i) => {
                const reader = new FileReader();
        
                // Create an image container with hover actions
                reader.onload = (e) => {
                    const container = document.createElement('div');
                    container.setAttribute('class', 'image-container');
        
                    const image = document.createElement('img');
                    image.src = e.target.result;
                    image.setAttribute('class', 'initial-23');
        
                    const actionIcons = document.createElement('div');
                    actionIcons.setAttribute('class', 'action-icons');
                    actionIcons.innerHTML = `
                        <a href="${e.target.result}" class="action-btn" title="View" target="_blank">
                        <input class="hiddenFileName" value="${files[0].name}" hidden/>
                            <i class="ph ph-eye"></i>
                        </a>
                        <a class="action-btn btn--danger btn-outline-danger form-alert" href="javascript:" title="Delete">
                            <i class="ph ph-trash"></i>
                        </a>
                    `;
        
                    // Append image and actions to the container
                    container.appendChild(image);
                    container.appendChild(actionIcons);
        
                    // Add uploaded images to the start of the container
                    imageContainer.insertBefore(container, imageContainer.firstChild);
                };
        
                reader.readAsDataURL(file); // Read the file as a data URL
            });
        });
        
        // Handle dynamic images from course.gallery
        if (course.gallery && course.gallery.length > 0) {
            course.gallery.forEach((e) => {
                // Create an image container with hover actions
                const container = document.createElement('div');
                container.setAttribute('class', 'image-container');
        
                const image = document.createElement('img');
                image.src = e;
                image.setAttribute('class', 'initial-23');
        
                const actionIcons = document.createElement('div');
                actionIcons.setAttribute('class', 'action-icons');
                actionIcons.innerHTML = `
                    <a href="${e}" class="action-btn" title="View" target="_blank">
                        <i class="ph ph-eye"></i>
                    </a>
                    <a class="action-btn btn--danger btn-outline-danger form-alert" href="javascript:" title="Delete">
                        <i class="ph ph-trash"></i>
                    </a>
                `;
        
                // Append image and actions to the container
                container.appendChild(image);
                container.appendChild(actionIcons);
        
                // Add fetched images to the container
                imageContainer.appendChild(container);
            });
        } else {
            // Default placeholder with hover actions
            imageContainer.innerHTML = `
                <div class="image-container">
                    <img class="initial-23" src="assets/images/thumbs/upload-image.png" alt="Employee" />
                    <div class="action-icons">
                        <a href="#" class="action-btn" title="View">
                            <i class="ph ph-eye"></i>
                        </a>
                        <a class="action-btn btn--danger btn-outline-danger form-alert" href="javascript:" title="Delete">
                            <i class="ph ph-trash"></i>
                        </a>
                    </div>
                </div>
            `;
        }
        
        // showFiles(image)

        // Render existing course materials
        if (course.materials.length > 0) {
            course.materials.map((e, i) => {
                courseFileTbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td><a href="${e}" target="_blank">File ${i + 1}</a></td>
                <td>
                    <div class="btn--container d-flex">
                        <a href="${e}" class="action-btn me-5" title="View">
                            <i class="ph ph-eye"></i>
                        </a>
                        <a class="action-btn btn--danger btn-outline-danger form-alert" href="javascript:" data-id="role-${i}" data-message="Want to delete this file?">
                            <i class="ph ph-trash"></i>
                        </a>
                    </div>
                </td>
            </tr>`;
            });
        }

        // Handle file uploads
        fileInput.addEventListener("change", (event) => {
            const files = Array.from(event.target.files); // Get selected files
            updateFiles = [...updateFiles, ...files];
            let currentRowCount = courseFileTbody.children.length; // Start numbering from current rows

            files.forEach((file, index) => {
                const fileReader = new FileReader();

                // Generate a temporary URL to display file (useful for preview purposes)
                fileReader.onload = (e) => {
                    courseFileTbody.innerHTML += `
                <tr>
                    <td>${currentRowCount + index + 1}</td>
                    <td><a href="${e.target.result}" target="_blank">${file.name}</a></td>
                    <td>
                        <div class="btn--container d-flex">
                            <a href="${e.target.result}" class="action-btn me-5" title="View">
                                <i class="ph ph-eye"></i>
                            </a>
                            <a class="action-btn btn--danger btn-outline-danger form-alert" href="javascript:" data-id="new-file-${index}" data-message="Want to delete this file?">
                                <i class="ph ph-trash"></i>
                            </a>
                        </div>
                    </td>
                </tr>`;
                };
                fileReader.readAsDataURL(file);
            });

            // Clear input after processing files (optional)
            event.target.value = "";
        });

    } catch (error) { console.log(error) }
    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    }
}
editLoadData()



//Update Course API
async function createCourse(event) {
    let _id = id
    event.preventDefault();
    let statusOfCards;
    console.log('event: ', event);
    if (event.target.id === 'publish-course') {
        statusOfCards = 'Publish'
        console.log(statusOfCards)
    } else {
        statusOfCards = 'Draft';
        console.log(statusOfCards);
    }
    const title = document.getElementById('courseTitle').value;
    const createdBy = localStorage.getItem('name');
    const instructor = document.getElementById('selectInstructor').value
    const description = document.getElementById('description').value;
    const category = document.getElementById('courseCategory').value;
    const duration = document.getElementById('courseDuration').value;
    const thumbnails = document.getElementById('fileUpload-2').files
    
    const materials = document.getElementById('multipleFileUpload').files
    try {
        loading_shimmer();
    } catch (error) { console.log(error); }
    // -----------------------------------------------------------------------------------
    try {
        const formData = new FormData();
        imageFiles.forEach((image) => {
            formData.append('gallery', image);
        });
        updateFiles.forEach((files)=>{
            formData.append('materials',files)
        })
        for (const thumbnail of thumbnails) {
            formData.append("thumbnail", thumbnail);
        }
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("statusOfCards", statusOfCards);
        formData.append("createdBy", createdBy);
        formData.append("duration", duration);
        formData.append("instructor", instructor);
        formData.append('_id',_id)

        const API = `${COURSE_UPDATE_API}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: formData
        });
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();
        console.log('THIS IS MY RESPONSE: ', r1)
        // -----------------------------------------------------------------------------------
        try {
            status_popup(r1?.message, (response?.ok));
            setTimeout(() => {
                window.location.href = 'student-courses.html';
            }, 1000)
        } catch (error) { console.log(error) }
    } catch (error) {
        status_popup(("Invalid Credentials"), (false));
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try {
        remove_loading_shimmer();
    } catch (error) { console.log(error); }
}

document.getElementById('save-as-draft').addEventListener('click', (event) => { createCourse(event) })
document.getElementById('publish-course').addEventListener('click', (event) => { createCourse(event) })


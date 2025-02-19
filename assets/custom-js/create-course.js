 if (!localStorage.getItem("token")) {
  localStorage.clear();
  window.location.href = 'sign-in.html';
}
import { COURSE_CREATE_API, COURSE_category_GETALL_API, USER_GETALL_API } from './global/apis.js'
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')

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
// -----------------------------------------------------------------------

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
        console.log('instructor: ',instructor);
        const selectInstructor = document.getElementById("selectInstructor");
        instructor?.forEach((instructors) => {
          const option = document.createElement("option");
          option.value = instructors._id;
          option.text = `${instructors?.first_name} ${instructors?.last_name} (${instructors?.userId})`;
          selectInstructor.appendChild(option);
        });
    }catch(error){
        console.log(error)
    }
}
dropdownInstructor()

async function createCourse(event){
    event.preventDefault();

    if(!validateCourse()) return

    let statusOfCards;
    console.log('event: ',event);
    if(event.target.id==='publish-course'){
        statusOfCards = 'Publish'
        console.log(statusOfCards)
    }else{
        statusOfCards = 'Draft';
        console.log(statusOfCards);
    }
    const title = document.getElementById('courseTitle').value;
     const createdBy = localStorage.getItem('name');
     // const createdBy = localStorage.getItem('name');
     const instructor = document.getElementById("selectInstructor").value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('courseCategory').value;
    const duration = document.getElementById('courseDuration').value;
    const thumbnails = document.getElementById('fileUpload-2').files
    const galleries = document.getElementById('multipleImageUpload').files
    const materials = document.getElementById('multipleFileUpload').files
    try{
        loading_shimmer();
    } catch(error){console.log(error);} 
    // -----------------------------------------------------------------------------------
    try{
        const formData = new FormData();
        // const files = document.getElementById("fileUpload").files;
for (const gallery of galleries) {
  formData.append("gallery", gallery);
}
for (const material of materials) {
  formData.append("materials", material);
}
for (const thumbnail of thumbnails) {
    formData.append("thumbnail", thumbnail);
  }
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("statusOfCards", statusOfCards);
      // formData.append("createdBy", createdBy);
      formData.append("duration", duration);
      formData.append("instructor", instructor);

        const API = `${COURSE_CREATE_API}`;
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
        console.log('THIS IS MY RESPONSE: ',r1)
        // debugger
        // -----------------------------------------------------------------------------------
        try{
            status_popup(r1?.message, (response?.ok));
            setTimeout(()=>{
                window.location.href = 'student-courses.html';
            },1000)
        } catch(error){console.log(error)}
    } catch(error){
        status_popup( ("Invalid Credentials"), (false));
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error);}
}

document.getElementById('save-as-draft').addEventListener('click',(event)=>{createCourse(event)})
document.getElementById('publish-course').addEventListener('click',(event)=>{createCourse(event)})

let courseDescription = document.getElementById('description');
let totalWords;
courseDescription.addEventListener('change',()=>{
  totalWords = courseDescription.value;
  console.log('words: ',totalWords.length)
})

// validation course
function validateCourse(){
    clearErrors();
  let isValid = true;
  const title = document.getElementById('courseTitle')
  const description = document.getElementById('description')
  const category = document.getElementById('courseCategory')
  const duration = document.getElementById('courseDuration')
  const validateDescription = document.getElementById('validateDescription')
    
    // if (!category.value.trim() || category.value === 'Enter course category') {
    //     showError(category, 'Enter a valid category');
    //     isValid = false;
    // }
    if(totalWords.length <= 100){
      showError(description,'Please enter 100 words atleast');
      isValid=false;
    }
    return isValid;
}

function showError(element, message) {
    const errorContainer = element.previousElementSibling; // Access the div with label
    let errorElement = errorContainer.querySelector('.text-danger.text-size');
  
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'text-danger text-size mohit_error_js_dynamic_validation';
        errorElement.style.fontSize = '10px';
        errorElement.innerHTML = `<i class="fa-solid fa-times"></i> ${message}`;
        errorContainer.appendChild(errorElement);
    } else {
        errorElement.innerHTML = `<i class="fa-solid fa-times"></i> ${message}`;
    }
  }
  // --------------------------------------------------------------------------------------------------
  // Function to clear all error messages
  // --------------------------------------------------------------------------------------------------
  function clearErrors() {
    const errorMessages = document.querySelectorAll('.text-danger.text-size.mohit_error_js_dynamic_validation');
    errorMessages.forEach((msg) => msg.remove());
  }


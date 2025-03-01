if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
import { USER_GET_API, USER_UPDATE_API, ROLE_GETALL_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================
//===============================================================================

let id = new URLSearchParams(window.location.search).get('id')

//Dropdown Role
async function dropdownRoles() {
    const API = ROLE_GETALL_API
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
    const role = document.getElementById("role");
    res?.roles.forEach((roles) => {
        const option = document.createElement("option");
        option.value = roles._id;
        option.text = `${roles?.roles}`;
        role.appendChild(option);
      });
    }
    catch(error){
        console.error('Error fetching data:', error);
    }
}
dropdownRoles();

//File Uploadation Code
let imageFiles = [];

document.getElementById("fileUpload").addEventListener("change", (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    imageFiles.push(...files); // Store actual File objects

    const imageContainer = document.getElementById("image-container");

    files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            // Create a container for the image
            const container = document.createElement("div");
            container.setAttribute("class", "image-container");

            // Create the image element
            const image = document.createElement("img");
            image.src = e.target.result;
            image.setAttribute("class", "initial-23");

            // Create the delete & view actions
            const actionIcons = document.createElement("div");
            actionIcons.setAttribute("class", "action-icons");
            actionIcons.innerHTML = `
                <a href="${e.target.result}" class="action-btn" title="View" target="_blank">
                    <i class="ph ph-eye"></i>
                </a>
                <a class="action-btn btn--danger btn-outline-danger form-alert delete-btn" href="javascript:" title="Delete">
                    <i class="ph ph-trash"></i>
                </a>
            `;

            // Append image & actions to container
            container.appendChild(image);
            container.appendChild(actionIcons);

            // **Prepend the new image (put it at the top)**
            imageContainer.prepend(container);

            // Add delete functionality
            actionIcons.querySelector(".delete-btn").addEventListener("click", () => {
                imageContainer.removeChild(container);
                // Remove file from imageFiles array
                imageFiles = imageFiles.filter(f => f !== file);
            });
        };

        reader.readAsDataURL(file);
    });
});

//===============================================================================
window.editLoadData = async function editLoadData() {
    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }
    
    const first_name = document.getElementById('fname');
    const last_name = document.getElementById('lname');
    const phoneNumber = document.getElementById('phone');
    const address = document.getElementById('address');
    const email = document.getElementById('email');
    const role = document.getElementById('role');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const imageFileUpload = document.getElementById('customFileUpload');
    const image = document.getElementById('viewer');
    const imageContainer = document.getElementById('image-container');

    try {
        const API = `${USER_GET_API}?_id=${id}`;
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

        const res = await response.json();
        const employee = res.user;
        console.log('This is my response: ', employee);

        first_name.value = employee.first_name;
        last_name.value = employee.last_name;
        phoneNumber.value = employee.phoneNumber;
        address.value = employee.address;
        email.value = employee.email;
        image.src = employee.image ? employee.image : 'assets/images/thumbs/upload-image.png';
        role.value = employee.roles._id;

        // Clear existing images before adding new ones
        imageContainer.innerHTML = '';

        // Append response images after file upload images
        if (employee.files && employee.files.length > 0) {
            employee.files.forEach((e) => {
                const container = document.createElement("div");
                container.setAttribute("class", "image-container");

                const img = document.createElement("img");
                img.src = e;
                img.setAttribute("class", "initial-24");

                const actionIcons = document.createElement("div");
                actionIcons.setAttribute("class", "action-icons");
                actionIcons.innerHTML = `
                    <a href="${e}" class="action-btn" title="View" target="_blank">
                        <i class="ph ph-eye"></i>
                    </a>
                    <a class="action-btn btn--danger btn-outline-danger form-alert delete-btn" href="javascript:" title="Delete">
                        <i class="ph ph-trash"></i>
                    </a>
                `;

                container.appendChild(img);
                container.appendChild(actionIcons);

                // **Append response images at the bottom**
                imageContainer.appendChild(container);
            });
        } else {
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
       
    } catch (error) { 
        console.error(error);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    }
};

// Call the function to load data
editLoadData();





//Update Employee API
let updateEmployeeForm = 'update-employee-form';
document.getElementById(updateEmployeeForm).addEventListener("submit", async function (event) {
    event.preventDefault();

    if(!editValidateEmployee()) return

    const first_name = document.getElementById('fname').value;
    const last_name = document.getElementById('lname').value;
    const phoneNumber = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const roles = document.getElementById('role').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const _id = id;
    const images = document.getElementById('customFileUpload').files
    try {
        loading_shimmer();
    } catch (error) { console.log(error); }
    // -----------------------------------------------------------------------------------
    try {
        const formData = new FormData();
        const files = document.getElementById("fileUpload").files;
        for (const file of files) {
            formData.append("files", file);
        }
        imageFiles.forEach((image)=>{
            formData.append("image", image); 
        })
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("phoneNumber", phoneNumber);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("roles", roles);
        formData.append("address", address);
        formData.append('_id',_id);

        const API = `${USER_UPDATE_API}`;
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
            setTimeout(()=>{
                window.location.href = 'employee-list.html'
            },2000)
        } catch (error) { console.log(error) }
    } catch (error) {
        status_popup(("Invalid Credentials"), (false));
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try {
        document.getElementById(updateEmployeeForm).reset();
        remove_loading_shimmer();
    } catch (error) { console.log(error); }
});

//Employee validation
function editValidateEmployee(){
    clearErrors();
  let isValid = true;
    const first_name = document.getElementById('fname')
    const last_name = document.getElementById('lname')
    const phoneNumber = document.getElementById('phone')
    const address = document.getElementById('address')
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const confirmPassword = document.getElementById('confirmPassword')
    // const imageFileUpload = document.getElementById('customFileUpload')
    // const spanProfilePhoto = document.getElementById('profile-photo')

    if(first_name.value.trim() ==='' || !/^[A-Za-z]+$/.test(first_name.value)){
      showError(first_name,'Enter a valid first name');
      isValid=false;
    }
    if(last_name.value.trim() ==='' || !/^[A-Za-z]+$/.test(last_name.value)){
      showError(last_name,'Enter a valid last name');
      isValid=false;
    }
    const phoneNumberValue = phoneNumber.value.trim();
    if (!phoneNumberValue || phoneNumberValue.length < 10 || phoneNumberValue.length > 13 || !/^\d+$/.test(phoneNumberValue)) {
        showError(phoneNumber, 'Enter a valid phone number (10-13 digits, numbers only)');
        isValid = false;
    }
    if (!address.value.trim()) {
        showError(address, 'Enter a valid address');
        isValid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailPattern.test(email.value)) {
      showError(email, 'Enter a valid email address');
      isValid = false;
  }
//   if(!password.value.trim()){
//     showError(password, 'Enter a valid password');
//       isValid = false;
//   }
//   if(!confirmPassword.value.trim()){
//     showError(password, 'Enter a valid password');
//       isValid = false;
//   }
  if(confirmPassword.value !== password.value){
    showError(confirmPassword, 'Your password is not Matched');
      isValid = false;
  }
//   if(imageFileUpload.files.length === 0){
//     let span = document.createElement('span');
//     span.innerText = 'Please Upload an image.'
//     spanProfilePhoto.appendChild(span);
//     isValid = false;
//   }
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



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

//===============================================================================
window.editLoadData = async function editLoadData() {
    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }
    const employeeName = document.getElementById('employee-name')
    const employeeRole = document.getElementById('employee-role')
    const employeePhoneNumber = document.getElementById('employee-phone-no')
    const employeeAddress = document.getElementById('employee-address')
    const employeEmail = document.getElementById('employe-email')
    const employeeImage = document.getElementById('employee-image')
    const fileExtension = ['.jpg', '.png', '.jpeg', '.gif', '.bmp', '.tif', '.tiff']
    const imagesContainer = document.getElementById('show-images')
    const viewerImage = document.getElementById('viewer-image');
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
        const res = await response.json()
        const employee = res.user;
        console.log('This is my response: ', employee);
        const first_name = employee.first_name ? employee.first_name : ""
        const last_name = employee.last_name ? employee.last_name : ""
        const fullName = first_name + " " + last_name
        employeeName.innerText = fullName;
        employeeRole.innerText = employee.roles?.roles? employee.roles?.roles : '-';
        employeePhoneNumber.innerText = employee.phoneNumber || '-';
        employeEmail.innerText = employee.email || '-';
        employeeAddress.innerText = employee.address || '-';
        employeeImage.src = employee.image || 'assets/images/thumbs/dummy-profile-pic.png';

        try {
            employee.files.length > 0 ? employee.files.map((e)=>{
                let image = document.createElement('img');
                let anchor = document.createElement('a');
                anchor.setAttribute('href',`${e}`)
                anchor.setAttribute('target','_blank')
                image.src = e
                image.setAttribute('class','initial-24 m-3')
                imagesContainer.appendChild(anchor);
                anchor.appendChild(image)        
            }) 
            : viewerImage.style.display = 'block'
            
        } catch (error) {
            console.log(error)
        }

    } catch (error) { }
    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    } 
}
editLoadData();

// showing Uploaded Images

//redirect to employee edit page
let editEmployee = document.getElementById('edit-employee')
editEmployee.addEventListener('click',()=>{
    window.location.href = `update-employee.html?id=${id}`
})
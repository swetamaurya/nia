if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
<<<<<<< HEAD
import { ADMIN_GET_API, USER_GET_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
const token = localStorage.getItem('token')
const roles = localStorage.getItem('roles')
=======
import { ADMIN_GET_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
const token = localStorage.getItem('token')
>>>>>>> 82fd20aeb23f6465758f355f0eaaef2508afb39a
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
    const adminName = document.getElementById('employee-name')
    const adminRole = document.getElementById('employee-role')
    const adminPhoneNumber = document.getElementById('employee-phone-no')
    const employeeAddress = document.getElementById('employee-address')
    const adminEmail = document.getElementById('employe-email')
    const adminImage = document.getElementById('employee-image')
    const fileExtension = ['.jpg', '.png', '.jpeg', '.gif', '.bmp', '.tif', '.tiff']
    const imagesContainer = document.getElementById('show-images')
    const viewerImage = document.getElementById('viewer-image');
    try {
<<<<<<< HEAD
        let API;
        if(roles.toLowerCase() == 'Admin'.toLowerCase() ){
                    API = `${ADMIN_GET_API}?_id=${id}`;
                } else {
                    API = `${USER_GET_API}?_id=${id}`;
                }
=======
        const API = `${ADMIN_GET_API}?_id=${id}`;
>>>>>>> 82fd20aeb23f6465758f355f0eaaef2508afb39a

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
<<<<<<< HEAD
        const admin = res.admin 
        if(admin){
=======
        const admin = res.admin;
>>>>>>> 82fd20aeb23f6465758f355f0eaaef2508afb39a
        adminName.innerText = admin.name;
        adminRole.innerText = admin.roles? admin.roles : ''
        adminPhoneNumber.innerText = admin.mobile || '-';
        adminEmail.innerText = admin.email || '-';
        // employeeAddress.innerText = employee.address || '-';
        adminImage.src = admin.image || '-';
<<<<<<< HEAD
        }
        else{
            const user = res.user
            const name = user.first_name + " " + user.last_name || '-'
            adminName.innerText = name;
        adminRole.innerText = user.roles.roles? user.roles.roles : ''
        adminPhoneNumber.innerText = user.phoneNumber || '-';
        adminEmail.innerText = user.email || '-';
        employeeAddress.innerText = user.address || '-';
        // adminImage.src = admin.image || '-';
        }
=======
>>>>>>> 82fd20aeb23f6465758f355f0eaaef2508afb39a

        // try {
        //     employee.files.length > 0 ? employee.files.map((e)=>{
        //         let image = document.createElement('img');
        //         let anchor = document.createElement('a');
        //         anchor.setAttribute('href',`${e}`)
        //         anchor.setAttribute('target','_blank')
        //         image.src = e
        //         image.setAttribute('class','initial-24 m-3')
        //         imagesContainer.appendChild(anchor);
        //         anchor.appendChild(image)        
        //     }) 
        //     : viewerImage.style.display = 'block'
            
        // } catch (error) {
        //     console.log(error)
        // }

    } catch (error) { }
    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    } 
}
editLoadData();

// showing Uploaded Images
import { ROLE_GET_API, ROLE_UPDATE_API, USER_GETALL_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================
//===============================================================================

let id = new URLSearchParams(window.location.search).get('id')

//Dropdown of User
let employee
async function loadEmployeeList() {
  try {
    const response = await fetch(USER_GETALL_API, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          Authorization: token,
      },
  }); 
 
  const res = await response.json();

employee = res.data
    const dropdown = document.getElementById('employeeDropdown');
    // Dynamically populate the dropdown
    employee.forEach((employee) => {
      const option = document.createElement('option');
      option.value = employee._id; // Assuming employee ID is stored in `_id`
      option.textContent = `${employee.first_name} ${employee.last_name}  (${employee.userId})`; // Assuming employee name is stored in `name`
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading employee list:', error);
  }
}

// Call the function to populate the dropdown on page load
loadEmployeeList();

//Creating Array for the Role
let permission=[];
function isChecked(){
    let dashboardObj={
     dashboardManagement: document.getElementById('dashboard-Management'),
     employeeManagement: document.getElementById('employee-Management'),
     courseManagement: document.getElementById('course-Management'),
     classManagement: document.getElementById('class-Management'),
     studentManagement: document.getElementById('student-Management'),
     MessagesManagement: document.getElementById('messages'),
     systemManagement: document.getElementById('system-Management'),
    }
    Object.keys(dashboardObj).forEach((key)=>{
        const element = dashboardObj[key];
        if (element.checked) {
            // Add to the array only if it's not already present
            if (!permission.includes(element.value)) {
                permission.push(element.value);
            }
        }
        else {
            // Remove the value from the array if unchecked
            const index = permission.indexOf(element.value);
            if (index > -1) {
                permission.splice(index, 1);
            }
        }
        console.log('kkkk: ',permission)
    })
}
document.getElementById('dashboard-Management').addEventListener('change',isChecked)
document.getElementById('employee-Management').addEventListener('change',isChecked)
document.getElementById('course-Management').addEventListener('change',isChecked)
document.getElementById('class-Management').addEventListener('change',isChecked)
document.getElementById('student-Management').addEventListener('change',isChecked)
document.getElementById('messages').addEventListener('change',isChecked)
document.getElementById('system-Management').addEventListener('change',isChecked)
document.getElementById('select_all').addEventListener('change',isChecked)


//===============================================================================
window.editLoadData = async function editLoadData() {

    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }
    const role = document.getElementById('role')
    const name = document.getElementById('employeeDropdown')
    let dashboardObj={
        dashboardManagement: document.getElementById('dashboard-Management'),
        employeeManagement: document.getElementById('employee-Management'),
        courseManagement: document.getElementById('course-Management'),
        classManagement: document.getElementById('class-Management'),
        studentManagement: document.getElementById('student-Management'),
        MessagesManagement: document.getElementById('messages'),
        systemManagement: document.getElementById('system-Management'),
       }
    try {
        const API = `${ROLE_GET_API}?_id=${id}`;
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
        const updateRole = res.role
        // console.log('bdvcjidsbvjd: s',updateRole)
        
        console.log('This is my role value: ',role.value)
        console.log('This is my updated role value: ',updateRole.roles)
        
        name.value = updateRole.name?._id || ''
            role.value = updateRole.roles || ''
            
        
        
        
        try {
            Object.keys(dashboardObj).forEach((e,i)=>{
                updateRole.permission.map((ee,ii)=>{
                    if(ee===dashboardObj[e].value){
                        dashboardObj[e].checked = true;
                        permission.push(dashboardObj[e].value);
                    }
                })
            })
        } catch (error) {
            console.log('This is my error: ',error);
        }

    } catch (error) { }
    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    }
}
setTimeout(()=>{
    editLoadData()
},500)

console.log('This is my permission: ',permission)
//==========================================================================
//Update API for the Roles
let updateRoleForm = 'update-role-form';
document.getElementById(updateRoleForm).addEventListener("submit", async function (event) {
    event.preventDefault();
        try{
            loading_shimmer();
        } catch(error){console.log(error);}
        // -----------------------------------------------------------------------------------
        try{
            const roles = document.getElementById('role').value.trim();
            const _id = id
            const name = document.getElementById('employeeDropdown').value.trim(); 
        let requestBody = { roles, permission, _id };
        if (name!="" && name!=undefined) {
            requestBody.name = name;
        }
            const API = `${ROLE_UPDATE_API}`;
            // -----------------------------------------------------------------------------------
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(requestBody),
            });
            // -----------------------------------------------------------------------------------
            const r1 = await response.json();
            console.log('THIS IS MY RESPONSE: ',r1)
            // -----------------------------------------------------------------------------------
            try{
                status_popup(r1?.message, (response?.ok));
                setTimeout(()=>{
                    window.location.href = 'employee-role-setup.html'
                },1000)
            } catch(error){console.log(error)}
        } catch(error){
            status_popup( ("Invalid Credentials"), (false));
            console.log(error);
        }
        // -----------------------------------------------------------------------------------
        try{
            document.getElementById(updateRoleForm).reset();
            remove_loading_shimmer();
        } catch(error){console.log(error);}
});
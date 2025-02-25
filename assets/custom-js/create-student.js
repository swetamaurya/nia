if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
import { STUDENT_CREATE_API ,BATCH_GETALL_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
// import { status_popup } from "../global/status_popup.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================
async function dropdownBtaches() {
    const API = BATCH_GETALL_API
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
    const batchId = document.getElementById("batchId");
    res?.data.forEach((batch) => {
        const option = document.createElement("option");
        option.value = batch._id;
        option.text = `${batch?.batchId}`;
        batchId.appendChild(option);
      });
    }
    catch(error){
        console.error('Error fetching data:', error);
    }
}
dropdownBtaches();
// Add Batch Form Function

async function addStudentForm(event) {
    event.preventDefault();
    
    // const batchId = document.getElementById('batchId').value
    // const application_number = document.getElementById('application_number').value;
    // const registration_number = document.getElementById('registration_number').value;
    // const first_name = document.getElementById('first_name').value;
    // const last_name = document.getElementById('last_name').value;
    // const father_husband_name = document.getElementById('father_husband_name').value;
    // const mother_name = document.getElementById('mother_name').value;
    // const date_of_birth = document.getElementById('date_of_birth').value;
    // const category = document.getElementById('category').value;
    // const email = document.getElementById('email').value;
    // const phone = document.getElementById('phone').value;
    // const gender = document.getElementById('gender').value;
    // const marital_status = document.getElementById('marital_status').value;
    // const photo_path = document.getElementById('photo_path').value;
    // const present_house_no = document.getElementById('present_house_no').value;
    // const present_village = document.getElementById('present_village').value;
    // const present_city = document.getElementById('present_city').value;
    // const present_post_office = document.getElementById('present_post_office').value;
    // const present_state = document.getElementById('present_state').value;
    // const present_district = document.getElementById('present_district').value;
    // const present_pincode = document.getElementById('present_pincode').value;
    // const permanent_street = document.getElementById('permanent_street').value;
    // const permanent_house_no = document.getElementById('permanent_house_no').value;
    // const permanent_village = document.getElementById('permanent_village').value;
    // const permanent_city = document.getElementById('permanent_city').value;
    // const permanent_post_office = document.getElementById('permanent_post_office').value;
    // const permanent_state = document.getElementById('permanent_state').value;
    // const permanent_district = document.getElementById('permanent_district').value;
    // const permanent_pincode = document.getElementById('permanent_pincode').value;
    // const educational_qualification = document.getElementById('educational_qualification').value;
    // const educational_qualification_division = document.getElementById('educational_qualification_division').value;
    // const intermediate_details = document.getElementById('intermediate_details').value;
    // const intermediate_details_division = document.getElementById('intermediate_details_division').value;
    // const high_school_details = document.getElementById('high_school_details').value;
    // const high_school_details_division = document.getElementById('high_school_details_division').value;
    // const apply_for = document.getElementById('apply_for').value;
    // const examination_fees = document.getElementById('examination_fees').value;
    // const examination_centre_state = document.getElementById('examination_centre_state').value;
    // const examination_centre_city = document.getElementById('examination_centre_city').value;

    const formData = new FormData();
    const signature_paths = document.getElementById('fileUpload-4').files;
    const photo_paths = document.getElementById('fileUpload-3').files;

    for (const signature_path of signature_paths) {
        formData.append("signature_path", signature_path);
    }
    
    for (const photo_path of photo_paths) {
        formData.append("photo_path", photo_path);
    }

    
formData.append('batchId', document.getElementById('batchId').value);
formData.append('application_number', document.getElementById('application_number').value);
formData.append('registration_number', document.getElementById('registration_number').value);
formData.append('first_name', document.getElementById('first_name').value);
formData.append('last_name', document.getElementById('last_name').value);
formData.append('father_husband_name', document.getElementById('father_husband_name').value);
formData.append('mother_name', document.getElementById('mother_name').value);
formData.append('date_of_birth', document.getElementById('date_of_birth').value);
formData.append('category', document.getElementById('category').value);
formData.append('email', document.getElementById('email').value);
formData.append('phone', document.getElementById('phone').value);
formData.append('gender', document.getElementById('gender').value);
formData.append('marital_status', document.getElementById('marital_status').value);
formData.append('present_street', document.getElementById('present_street').value);
formData.append('present_house_no', document.getElementById('present_house_no').value);
formData.append('present_village', document.getElementById('present_village').value);
formData.append('present_city', document.getElementById('present_city').value);
formData.append('present_post_office', document.getElementById('present_post_office').value);
formData.append('present_state', document.getElementById('present_state').value);
formData.append('present_district', document.getElementById('present_district').value);
formData.append('present_pincode', document.getElementById('present_pincode').value);
formData.append('permanent_street', document.getElementById('permanent_street').value);
formData.append('permanent_house_no', document.getElementById('permanent_house_no').value);
formData.append('permanent_village', document.getElementById('permanent_village').value);
formData.append('permanent_city', document.getElementById('permanent_city').value);
formData.append('permanent_post_office', document.getElementById('permanent_post_office').value);
formData.append('permanent_state', document.getElementById('permanent_state').value);
formData.append('permanent_district', document.getElementById('permanent_district').value);
formData.append('permanent_pincode', document.getElementById('permanent_pincode').value);
formData.append('educational_qualification', document.getElementById('educational_qualification').value);
formData.append('educational_qualification_division', document.getElementById('educational_qualification_division').value);
formData.append('intermediate_details', document.getElementById('intermediate_details').value);
formData.append('intermediate_details_division', document.getElementById('intermediate_details_division').value);
formData.append('high_school_details', document.getElementById('high_school_details').value);
formData.append('high_school_details_division', document.getElementById('high_school_details_division').value);
formData.append('apply_for', document.getElementById('apply_for').value);
formData.append('examination_fees', document.getElementById('examination_fees').value);
formData.append('examination_centre_state', document.getElementById('examination_centre_state').value);
formData.append('examination_centre_city', document.getElementById('examination_centre_city').value);
formData.append('password', document.getElementById('password').value);
formData.append('status', document.getElementById('status').value);


    
    try {
        loading_shimmer();
    } catch (error) {
        console.log(error);
    }

    try {
        const API = `${STUDENT_CREATE_API}`;

        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: formData
        });

        const r1 = await response.json();
        console.log('THIS IS MY RESPONSE: ', r1);

         // Show the status message
         try {
            status_popup(r1?.message, response?.ok);
        } catch (error) {
            console.log(error);
        }

        // Redirect only if the response is successful
        if (response.ok) {
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 1000);
        }
    } catch (error) {
        status_popup("Batch is not created", false);
        console.log(error);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.log(error);
    }
}


document.getElementById('submit').addEventListener('click',(event)=>{addStudentForm(event)})
// document.getElementById('cancel').addEventListener('click',(event)=>{resetBatchForm(event)});


// /Autofill the filled if the element is checked
let permanentAddress = document.getElementById('sameAsPermanent')
permanentAddress.addEventListener('change',(e)=>{
    let permanent_street = document.getElementById('permanent_street').value
    let permanent_house_no = document.getElementById('permanent_house_no').value
    let permanent_village = document.getElementById('permanent_village').value
    let permanent_city = document.getElementById('permanent_city').value
    let permanent_post_office = document.getElementById('permanent_post_office').value
    let permanent_state = document.getElementById('permanent_state').value
    let permanent_district = document.getElementById('permanent_district').value
    let permanent_pincode = document.getElementById('permanent_pincode').value
    if(e.target.checked === true){
        document.getElementById('present_street').value = permanent_street
        document.getElementById('present_house_no').value = permanent_house_no
        document.getElementById('present_village').value = permanent_village
        document.getElementById('present_city').value = permanent_city
        document.getElementById('present_post_office').value = permanent_post_office
        document.getElementById('present_state').value = permanent_state
        document.getElementById('present_district').value = permanent_district
        document.getElementById('present_pincode').value = permanent_pincode
    }
    else{
        document.getElementById('present_street').value = ""
        document.getElementById('present_house_no').value = ""
        document.getElementById('present_village').value = ""
        document.getElementById('present_city').value = ""
        document.getElementById('present_post_office').value = ""
        document.getElementById('present_state').value = ""
        document.getElementById('present_district').value = ""
        document.getElementById('present_pincode').value = ""
    }
})
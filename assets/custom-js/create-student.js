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
    // const applicationNumber = document.getElementById('applicationNumber').value;
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
    // const photo_path = document.getElementById('uploadPhoto').value;
    // const presentHouseNo = document.getElementById('presentHouseNo').value;
    // const present_village = document.getElementById('present_village').value;
    // const present_city = document.getElementById('present_city').value;
    // const presentPostOffice = document.getElementById('presentPostOffice').value;
    // const present_state = document.getElementById('present_state').value;
    // const presentDistrict = document.getElementById('presentDistrict').value;
    // const presentPincode = document.getElementById('presentPincode').value;
    // const permanentStreet = document.getElementById('permanentStreet').value;
    // const permanentHouseNo = document.getElementById('permanentHouseNo').value;
    // const permanent_village = document.getElementById('permanent_village').value;
    // const permanent_city = document.getElementById('permanent_city').value;
    // const permanent_post_office = document.getElementById('permanent_post_office').value;
    // const permanent_state = document.getElementById('permanent_state').value;
    // const permanent_district = document.getElementById('permanent_district').value;
    // const permanent_pincode = document.getElementById('permanent_pincode').value;
    // const educational_qualification = document.getElementById('educational_qualification').value;
    // const educational_qualification_division = document.getElementById('educational_qualification_division').value;
    // const intermediate_details = document.getElementById('intermediate_details').value;
    // const intermediate_detailsDivision = document.getElementById('intermediate_detailsDivision').value;
    // const highSchoolDetails = document.getElementById('highSchoolDetails').value;
    // const highSchoolDetailsDivision = document.getElementById('highSchoolDetailsDivision').value;
    // const applyFor = document.getElementById('applyFor').value;
    // const examinationFee = document.getElementById('examinationFee').value;
    // const examinationCenterState = document.getElementById('examinationCenterState').value;
    // const examinationCenterCity = document.getElementById('examinationCenterCity').value;

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
formData.append('applicationNumber', document.getElementById('applicationNumber').value);
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
formData.append('presentHouseNo', document.getElementById('presentHouseNo').value);
formData.append('present_village', document.getElementById('present_village').value);
formData.append('present_city', document.getElementById('present_city').value);
formData.append('presentPostOffice', document.getElementById('presentPostOffice').value);
formData.append('present_state', document.getElementById('present_state').value);
formData.append('presentDistrict', document.getElementById('presentDistrict').value);
formData.append('presentPincode', document.getElementById('presentPincode').value);
formData.append('permanentStreet', document.getElementById('permanentStreet').value);
formData.append('permanentHouseNo', document.getElementById('permanentHouseNo').value);
formData.append('permanent_village', document.getElementById('permanent_village').value);
formData.append('permanent_city', document.getElementById('permanent_city').value);
formData.append('permanent_post_office', document.getElementById('permanent_post_office').value);
formData.append('permanent_state', document.getElementById('permanent_state').value);
formData.append('permanent_district', document.getElementById('permanent_district').value);
formData.append('permanent_pincode', document.getElementById('permanent_pincode').value);
formData.append('educational_qualification', document.getElementById('educational_qualification').value);
formData.append('educational_qualification_division', document.getElementById('educational_qualification_division').value);
formData.append('intermediate_details', document.getElementById('intermediate_details').value);
formData.append('intermediate_detailsDivision', document.getElementById('intermediate_detailsDivision').value);
formData.append('highSchoolDetails', document.getElementById('highSchoolDetails').value);
formData.append('highSchoolDetailsDivision', document.getElementById('highSchoolDetailsDivision').value);
formData.append('applyFor', document.getElementById('applyFor').value);
formData.append('examinationFee', document.getElementById('examinationFee').value);
formData.append('examinationCenterState', document.getElementById('examinationCenterState').value);
formData.append('examinationCenterCity', document.getElementById('examinationCenterCity').value);

    
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
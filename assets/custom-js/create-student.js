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
    // const registrationNumber = document.getElementById('registrationNumber').value;
    // const firstName = document.getElementById('firstName').value;
    // const lastName = document.getElementById('lastName').value;
    // const fatherHusbandName = document.getElementById('fatherHusbandName').value;
    // const motherName = document.getElementById('motherName').value;
    // const dateOfBirth = document.getElementById('dateOfBirth').value;
    // const category = document.getElementById('category').value;
    // const email = document.getElementById('email').value;
    // const mobile = document.getElementById('mobile').value;
    // const gender = document.getElementById('gender').value;
    // const maritalStatus = document.getElementById('maritalStatus').value;
    // const profileImage = document.getElementById('uploadPhoto').value;
    // const presentHouseNo = document.getElementById('presentHouseNo').value;
    // const presentVillage = document.getElementById('presentVillage').value;
    // const presentCity = document.getElementById('presentCity').value;
    // const presentPostOffice = document.getElementById('presentPostOffice').value;
    // const presentState = document.getElementById('presentState').value;
    // const presentDistrict = document.getElementById('presentDistrict').value;
    // const presentPincode = document.getElementById('presentPincode').value;
    // const permanentStreet = document.getElementById('permanentStreet').value;
    // const permanentHouseNo = document.getElementById('permanentHouseNo').value;
    // const permanentVillage = document.getElementById('permanentVillage').value;
    // const permanentCity = document.getElementById('permanentCity').value;
    // const permanentPostOffice = document.getElementById('permanentPostOffice').value;
    // const permanentState = document.getElementById('permanentState').value;
    // const permanentDistrict = document.getElementById('permanentDistrict').value;
    // const permanentPincode = document.getElementById('permanentPincode').value;
    // const educationalQualification = document.getElementById('educationalQualification').value;
    // const educationalQualificationDivision = document.getElementById('educationalQualificationDivision').value;
    // const intermediateDetails = document.getElementById('intermediateDetails').value;
    // const intermediateDetailsDivision = document.getElementById('intermediateDetailsDivision').value;
    // const highSchoolDetails = document.getElementById('highSchoolDetails').value;
    // const highSchoolDetailsDivision = document.getElementById('highSchoolDetailsDivision').value;
    // const applyFor = document.getElementById('applyFor').value;
    // const examinationFee = document.getElementById('examinationFee').value;
    // const examinationCenterState = document.getElementById('examinationCenterState').value;
    // const examinationCenterCity = document.getElementById('examinationCenterCity').value;

    const formData = new FormData();
    const signatureImages = document.getElementById('fileUpload-4').files;
    const profileImages = document.getElementById('fileUpload-3').files;

    for (const signatureImage of signatureImages) {
        formData.append("signatureImage", signatureImage);
    }
    
    for (const profileImage of profileImages) {
        formData.append("profileImage", profileImage);
    }

    
    formData.append('batchId', document.getElementById('batchId').value);
formData.append('applicationNumber', document.getElementById('applicationNumber').value);
formData.append('registrationNumber', document.getElementById('registrationNumber').value);
formData.append('firstName', document.getElementById('firstName').value);
formData.append('lastName', document.getElementById('lastName').value);
formData.append('fatherHusbandName', document.getElementById('fatherHusbandName').value);
formData.append('motherName', document.getElementById('motherName').value);
formData.append('dateOfBirth', document.getElementById('dateOfBirth').value);
formData.append('category', document.getElementById('category').value);
formData.append('email', document.getElementById('email').value);
formData.append('mobile', document.getElementById('mobile').value);
formData.append('gender', document.getElementById('gender').value);
formData.append('maritalStatus', document.getElementById('maritalStatus').value);
formData.append('presentStreet', document.getElementById('presentStreet').value);
formData.append('presentHouseNo', document.getElementById('presentHouseNo').value);
formData.append('presentVillage', document.getElementById('presentVillage').value);
formData.append('presentCity', document.getElementById('presentCity').value);
formData.append('presentPostOffice', document.getElementById('presentPostOffice').value);
formData.append('presentState', document.getElementById('presentState').value);
formData.append('presentDistrict', document.getElementById('presentDistrict').value);
formData.append('presentPincode', document.getElementById('presentPincode').value);
formData.append('permanentStreet', document.getElementById('permanentStreet').value);
formData.append('permanentHouseNo', document.getElementById('permanentHouseNo').value);
formData.append('permanentVillage', document.getElementById('permanentVillage').value);
formData.append('permanentCity', document.getElementById('permanentCity').value);
formData.append('permanentPostOffice', document.getElementById('permanentPostOffice').value);
formData.append('permanentState', document.getElementById('permanentState').value);
formData.append('permanentDistrict', document.getElementById('permanentDistrict').value);
formData.append('permanentPincode', document.getElementById('permanentPincode').value);
formData.append('educationalQualification', document.getElementById('educationalQualification').value);
formData.append('educationalQualificationDivision', document.getElementById('educationalQualificationDivision').value);
formData.append('intermediateDetails', document.getElementById('intermediateDetails').value);
formData.append('intermediateDetailsDivision', document.getElementById('intermediateDetailsDivision').value);
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
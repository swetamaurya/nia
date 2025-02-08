import { STUDENT_GET_API, BATCH_GETALL_API ,STUDENT_UPDATE_API} from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================
//===============================================================================

let id = new URLSearchParams(window.location.search).get('id')

//==============================================================================
//Dropdowm courses
//Dropdown for Course
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

//===============================================================================
window.editLoadData = async function editLoadData() {
    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }
    const batchId = document.getElementById('batchId')
    const applicationNumber = document.getElementById('applicationNumber');
    const registrationNumber = document.getElementById('registrationNumber');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const fatherHusbandName = document.getElementById('fatherHusbandName');
    const motherName = document.getElementById('motherName');
    const dateOfBirth = document.getElementById('dateOfBirth');
    const category = document.getElementById('category');
    const email = document.getElementById('email');
    const mobile = document.getElementById('mobile');
    const gender = document.getElementById('gender');
    const maritalStatus = document.getElementById('maritalStatus');
    const profileImage = document.getElementById('uploadPhoto');
    const presentHouseNo = document.getElementById('presentHouseNo');
    const presentVillage = document.getElementById('presentVillage');
    const presentCity = document.getElementById('presentCity');
    const presentPostOffice = document.getElementById('presentPostOffice');
    const presentState = document.getElementById('presentState');
    const presentDistrict = document.getElementById('presentDistrict');
    const presentPincode = document.getElementById('presentPincode');
    const permanentStreet = document.getElementById('permanentStreet');
    const permanentHouseNo = document.getElementById('permanentHouseNo');
    const permanentVillage = document.getElementById('permanentVillage');
    const permanentCity = document.getElementById('permanentCity');
    const permanentPostOffice = document.getElementById('permanentPostOffice');
    const permanentState = document.getElementById('permanentState');
    const permanentDistrict = document.getElementById('permanentDistrict');
    const permanentPincode = document.getElementById('permanentPincode');
    const educationalQualification = document.getElementById('educationalQualification');
    const educationalQualificationDivision = document.getElementById('educationalQualificationDivision');
    const intermediateDetails = document.getElementById('intermediateDetails');
    const intermediateDetailsDivision = document.getElementById('intermediateDetailsDivision');
    const highSchoolDetails = document.getElementById('highSchoolDetails');
    const highSchoolDetailsDivision = document.getElementById('highSchoolDetailsDivision');
    const applyFor = document.getElementById('applyFor');
    const examinationFee = document.getElementById('examinationFee');
    const examinationCenterState = document.getElementById('examinationCenterState');
    const examinationCenterCity = document.getElementById('examinationCenterCity');

    try {
        const API = `${STUDENT_GET_API}?_id=${id}`;

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
        const student = res.student
        batchId.value = student.batchId || '';
        applicationNumber.value = student.applicationNumber || '';
    registrationNumber.value = student.registrationNumber || '';
    firstName.value = student.firstName || '';
    lastName.value = student.lastName || '';
    fatherHusbandName.value = student.fatherHusbandName || '';
    motherName.value = student.motherName || '';
    dateOfBirth.value = student.dateOfBirth || '';
    category.value = student.category || '';
    email.value = student.email || '';
    mobile.value = student.mobile || '';
    gender.value = student.gender || '';
    maritalStatus.value = student.maritalStatus || '';
    profileImage.value = student.profileImage || '';
    presentHouseNo.value = student.presentHouseNo || '';
    presentVillage.value = student.presentVillage || '';
    presentCity.value = student.presentCity || '';
    presentPostOffice.value = student.presentPostOffice || '';
    presentState.value = student.presentState || '';
    presentDistrict.value = student.presentDistrict || '';
    presentPincode.value = student.presentPincode || '';
    permanentStreet.value = student.permanentStreet || '';
    permanentHouseNo.value = student.permanentHouseNo || '';
    permanentVillage.value = student.permanentVillage || '';
    permanentCity.value = student.permanentCity || '';
    permanentPostOffice.value = student.permanentPostOffice || '';
    permanentState.value = student.permanentState || '';
    permanentDistrict.value = student.permanentDistrict || '';
    permanentPincode.value = student.permanentPincode || '';
    educationalQualification.value = student.educationalQualification || '';
    educationalQualificationDivision.value = student.educationalQualificationDivision || '';
    intermediateDetails.value = student.intermediateDetails || '';
    intermediateDetailsDivision.value = student.intermediateDetailsDivision || '';
    highSchoolDetails.value = student.highSchoolDetails || '';
    highSchoolDetailsDivision.value = student.highSchoolDetailsDivision || '';
    applyFor.value = student.applyFor || '';
    examinationFee.value = student.examinationFee || '';
    examinationCenterState.value = student.examinationCenterState || '';
    examinationCenterCity.value = student.examinationCenterCity || '';
    } catch (error) { console.log(error) }
    try {
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    }
}
editLoadData()


//===============================================================================
// ✅ Submit Batch Form (Edit)
async function editBatchForm(event) {
    event.preventDefault();

    const batchId = document.getElementById('batchId').value;
    const applicationNumber = document.getElementById('applicationNumber').value;
    const registrationNumber = document.getElementById('registrationNumber').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const fatherHusbandName = document.getElementById('fatherHusbandName').value;
    const motherName = document.getElementById('motherName').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const category = document.getElementById('category').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const gender = document.getElementById('gender').value;
    const maritalStatus = document.getElementById('maritalStatus').value;
    const profileImage = document.getElementById('uploadPhoto').value;
    const presentHouseNo = document.getElementById('presentHouseNo').value;
    const presentVillage = document.getElementById('presentVillage').value;
    const presentCity = document.getElementById('presentCity').value;
    const presentPostOffice = document.getElementById('presentPostOffice').value;
    const presentState = document.getElementById('presentState').value;
    const presentDistrict = document.getElementById('presentDistrict').value;
    const presentPincode = document.getElementById('presentPincode').value;
    const permanentStreet = document.getElementById('permanentStreet').value;
    const permanentHouseNo = document.getElementById('permanentHouseNo').value;
    const permanentVillage = document.getElementById('permanentVillage').value;
    const permanentCity = document.getElementById('permanentCity').value;
    const permanentPostOffice = document.getElementById('permanentPostOffice').value;
    const permanentState = document.getElementById('permanentState').value;
    const permanentDistrict = document.getElementById('permanentDistrict').value;
    const permanentPincode = document.getElementById('permanentPincode').value;
    const educationalQualification = document.getElementById('educationalQualification').value;
    const educationalQualificationDivision = document.getElementById('educationalQualificationDivision').value;
    const intermediateDetails = document.getElementById('intermediateDetails').value;
    const intermediateDetailsDivision = document.getElementById('intermediateDetailsDivision').value;
    const highSchoolDetails = document.getElementById('highSchoolDetails').value;
    const highSchoolDetailsDivision = document.getElementById('highSchoolDetailsDivision').value;
    const applyFor = document.getElementById('applyFor').value;
    const examinationFee = document.getElementById('examinationFee').value;
    const examinationCenterState = document.getElementById('examinationCenterState').value;
    const examinationCenterCity = document.getElementById('examinationCenterCity').value;
    const _id = id;

    try {
        loading_shimmer();
    } catch (error) {
        console.log(error);
    }

    try {
        const API = `${STUDENT_UPDATE_API}`;
        const response = await fetch(API, {
            method: 'POST', //   Changed from POST to PATCH (for updates)
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ batchId, applicationNumber, registrationNumber, firstName, lastName, fatherHusbandName,motherName,dateOfBirth,category,email,mobile,gender,maritalStatus,profileImage,presentHouseNo,presentVillage,presentCity,presentPostOffice,presentState,presentDistrict,presentPincode,permanentStreet,permanentHouseNo,permanentVillage,permanentCity,permanentPostOffice,permanentState,permanentDistrict,permanentPincode,educationalQualification, educationalQualificationDivision,intermediateDetails,intermediateDetailsDivision,highSchoolDetails,highSchoolDetailsDivision,applyFor,examinationFee,examinationCenterState,examinationCenterCity,_id })
        });

        const r1 = await response.json();
        console.log('Batch Update Response:', r1);

        try {
            status_popup(r1?.message, response.ok);
        } catch (error) {
            console.log(error);
        }

        if (response.ok) {
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 1000);
        }
    } catch (error) {
        status_popup("Batch update failed", false);
        console.log(error);
    }

    try {
        remove_loading_shimmer();
    } catch (error) {
        console.log(error);
    }
}

//   Reset Form
function resetBatchForm(event) {
    event.preventDefault();
    document.getElementById('BatchTitle').value = '';
    document.getElementById('batchYear').value = '';
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
    document.getElementById('batchTotalDays').value = '';
    document.getElementById('studentDropdown').selectedIndex = 0;
}

//   Attach Event Listeners
document.getElementById('submit').addEventListener('click', editBatchForm);
document.getElementById('cancel').addEventListener('click', resetBatchForm);

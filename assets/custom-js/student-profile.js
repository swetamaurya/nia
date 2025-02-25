if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
import { STUDENT_GET_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
const token = localStorage.getItem('token')
const studentRole = localStorage.getItem('roles')
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
    const studentName = document.getElementById('student-name')
    const studentRole = document.getElementById('student-role')
    const studentPhoneNumber = document.getElementById('student-phone-no')
    const studentAddress = document.getElementById('student-address')
    const studentEmail = document.getElementById('student-email')
    const studentBatchId = document.getElementById('student-batch-id')
    const studentPaymentStatus = document.getElementById('student-payment-status')
    const studentApplicationNo = document.getElementById('student-application-no')
    const studentRegistrationNo = document.getElementById('student-registration-no')
    const studentApplyFor = document.getElementById('student-apply-for')
    const studentExaminationFee = document.getElementById('student-examination-fee')
    const studentCenterCity = document.getElementById('student-center-city')
    const studentFatherHusbandName = document.getElementById('student-father-husband-name')
    const studentMotherName = document.getElementById('student-mother-name')
    const studentDateOfBirth = document.getElementById('student-date-of-birth')
    const studentMaritalStatus = document.getElementById('student-marital-status')
    const studentCategory = document.getElementById('student-category')
    const studentGender = document.getElementById('student-gender')
    const studentPermanentAddress = document.getElementById('student-permanent-address')
    const studentPresentAddress = document.getElementById('student-present-address')
    const studentEducationalQualification = document.getElementById('student-educational-qualification')
    const studentEducationalQualificationDivision = document.getElementById('student-educational-qualification-division')
    const studentIntermediateDetails = document.getElementById('student-intermediate-details')
    const studentIntermediateDetailsDivision = document.getElementById('student-intermediate-details-division')
    const studentHighSchoolDetails = document.getElementById('student-high-school-details')
    const studentHighSchoolDetailsDivision = document.getElementById('student-high-school-details-division')
    const studentPhoto = document.getElementById('student-photo');
    const studentSignature = document.getElementById('student-signature');
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
        console.log('data: ',res);
        const student = res.student;

        //Concatenate Fields-----------------------
        const firstName = student?.first_name || '';
        const lastName = student?.last_name || '';
        const fullName = firstName + " " + lastName
        const city = student.examination_centre_city || '';
        const state = student.examination_centre_state || '';
        const cityConcatState = city + ", " + state

        const permanentAddressObj = {
            permanent_house_no: student.permanent_house_no || "",
            permanent_street: student.permanent_street || "",
            permanent_village: student.permanent_village || "",
            permanent_post_office: student.permanent_post_office || "",
            permanent_city: student.permanent_city || "",
            permanent_district: student.permanent_district || "",
            permanent_state: student.permanent_state || "",
            permanent_pincode: student.permanent_pincode || "",
        };

        const presentAddressObj = {
            present_house_no: student.present_house_no || "",
            present_street: student.present_street || "",
            present_village: student.present_village || "",
            present_post_office: student.present_post_office || "",
            present_city: student.present_city || "",
            present_district: student.present_district || "",
            present_state: student.present_state || "",
            present_pincode: student.present_pincode || "",
        };
        const permanentAddress = Object.values(permanentAddressObj).filter(Boolean).join(", ");
        const presentAddress = Object.values(presentAddressObj).filter(Boolean).join(", ");

        
        //-----------------------------------------

        studentName.innerText = fullName;
        // studentRole.innerText = studentRole? studentRole : ''
        studentPhoneNumber.innerText = student.phone || '-';
        studentEmail.innerText = student.email || '-';
        // studentAddress.innerText = student.address || '-';
        studentApplicationNo.innerText = student.application_number || '';
        studentRegistrationNo.innerText = student.registration_number || ''
        studentApplyFor.innerText = student.apply_for || ''
        studentExaminationFee.innerText = student.examination_fees || ''
        studentCenterCity.innerText = cityConcatState
        studentFatherHusbandName.innerText = student.father_husband_name || '';
        studentMotherName.innerText = student.mother_name || '';
        studentDateOfBirth.innerText = student.date_of_birth || '';
        studentMaritalStatus.innerText = student.marital_status || '';
        studentCategory.innerText = student.category || '';
        studentGender.innerText = student.gender || '';
        studentPermanentAddress.innerText = permanentAddress;
        studentPresentAddress.innerText = presentAddress;
        studentEducationalQualification.innerText = student.educational_qualification || '';
        studentEducationalQualificationDivision.innerText = student.educational_qualification_division || '';
        studentIntermediateDetails.innerText = student.intermediate_details || '';
        studentIntermediateDetailsDivision.innerText = student.intermediate_details_division || '';
        studentHighSchoolDetails.innerText = student.high_school_details || '';
        studentHighSchoolDetailsDivision.innerText = student.high_school_details_division || '';
        studentPhoto.src = student.photo_path || '';
        studentSignature.src = student.signature_path || '';


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
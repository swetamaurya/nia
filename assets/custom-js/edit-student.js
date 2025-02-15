if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
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
    const application_number = document.getElementById('application_number');
    const registration_number = document.getElementById('registration_number');
    const first_name = document.getElementById('first_name');
    const last_name = document.getElementById('last_name');
    const father_husband_name = document.getElementById('father_husband_name');
    const mother_name = document.getElementById('mother_name');
    const date_of_birth = document.getElementById('date_of_birth');
    const category = document.getElementById('category');
    // const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const gender = document.getElementById('gender');
    const marital_status = document.getElementById('marital_status');
    const photo_path = document.getElementById('photo_path');
    const present_street = document.getElementById('present_street')
    const present_house_no = document.getElementById('present_house_no');
    const present_village = document.getElementById('present_village');
    const present_city = document.getElementById('present_city');
    const present_post_office = document.getElementById('present_post_office');
    const present_state = document.getElementById('present_state');
    const present_district = document.getElementById('present_district');
    const present_pincode = document.getElementById('present_pincode');
    const permanent_street = document.getElementById('permanent_street');
    const permanent_house_no = document.getElementById('permanent_house_no');
    const permanent_village = document.getElementById('permanent_village');
    const permanent_city = document.getElementById('permanent_city');
    const permanent_post_office = document.getElementById('permanent_post_office');
    const permanent_state = document.getElementById('permanent_state');
    const permanent_district = document.getElementById('permanent_district');
    const permanent_pincode = document.getElementById('permanent_pincode');
    const educational_qualification = document.getElementById('educational_qualification');
    const educational_qualification_division = document.getElementById('educational_qualification_division');
    const intermediate_details = document.getElementById('intermediate_details');
    const intermediate_details_division = document.getElementById('intermediate_details_division');
    const high_school_details = document.getElementById('high_school_details');
    const high_school_details_division = document.getElementById('high_school_details_division');
    const apply_for = document.getElementById('apply_for');
    const examination_fees = document.getElementById('examination_fees');
    const examination_centre_state = document.getElementById('examination_centre_state');
    const examination_centre_city = document.getElementById('examination_centre_city');
    const status =document.getElementById('status');
    const profilePhoto = document.getElementById('viewer1')
    const signaturePhoto = document.getElementById('viewer2')
    // formData.append('status', document.getElementById('status').value);


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
        console.log('hkhk: ',student);
        batchId.value = student.batchId || '';
        application_number.value = student.application_number || '';
    registration_number.value = student.registration_number || '';
    first_name.value = student.first_name || '';
    last_name.value = student.last_name || '';
    father_husband_name.value = student.father_husband_name || '';
    mother_name.value = student.mother_name || '';
    date_of_birth.value = student.date_of_birth || '';
    category.value = student.category || '';
    // email.value = student.email || '';
    phone.value = student.phone || '';
    gender.value = student.gender || '';
    marital_status.value = student.marital_status || '';
    // photo_path.value = student.photo_path || '';
    present_street.value = student.present_street || '';
    present_house_no.value = student.permanent_house_no || '';
    present_village.value = student.present_village || '';
    present_city.value = student.present_city || '';
    present_post_office.value = student.present_post_office || '';
    present_state.value = student.present_state || '';
    present_district.value = student.present_district || '';
    present_pincode.value = student.present_pincode || '';
    permanent_street.value = student.permanent_street || '';
    permanent_house_no.value = student.present_post_office || '';
    permanent_village.value = student.permanent_village || '';
    permanent_city.value = student.permanent_city || '';
    permanent_post_office.value = student.permanent_post_office || '';
    permanent_state.value = student.permanent_state || '';
    permanent_district.value = student.permanent_district || '';
    permanent_pincode.value = student.permanent_pincode || '';
    educational_qualification.value = student.educational_qualification || '';
    educational_qualification_division.value = student.educational_qualification_division || '';
    intermediate_details.value = student.intermediate_details || '';
    intermediate_details_division.value = student.intermediate_details_division || '';
    high_school_details.value = student.high_school_details || '';
    high_school_details_division.value = student.high_school_details_division || '';
    apply_for.value = student.apply_for || '';
    examination_fees.value = student.examination_fees || '';
    examination_centre_state.value = student.examination_centre_state || '';
    examination_centre_city.value = student.examination_centre_city || '';
    status.value = student.status || ''
    student.photo_path? profilePhoto.src = student.photo_path : profilePhoto.src = "assets/images/thumbs/upload-image.png"
    student.signature_path? signaturePhoto.src = student.signature_path : signaturePhoto.src = "assets/images/thumbs/upload-image.png"

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
    const formData = new FormData();

     const photo_paths = document.getElementById('fileUpload-1').files;
    const signature_paths = document.getElementById('fileUpload-2').files;

    
    for (const photo_path of photo_paths) {
        formData.append("photo_path", photo_path);
    }
    for (const signature_path of signature_paths) {
        formData.append("signature_path", signature_path);
    }
    
    formData.append('present_house_no', document.getElementById('present_house_no').value);
formData.append('present_village', document.getElementById('present_village').value);
formData.append('present_city', document.getElementById('present_city').value);
formData.append('present_post_office', document.getElementById('present_post_office').value);
formData.append('present_state', document.getElementById('present_state').value);
formData.append('present_district', document.getElementById('present_district').value);
formData.append('present_pincode', document.getElementById('present_pincode').value);

// Permanent Address
formData.append('permanent_street', document.getElementById('permanent_street').value);
formData.append('permanent_house_no', document.getElementById('permanent_house_no').value);
formData.append('permanent_village', document.getElementById('permanent_village').value);
formData.append('permanent_city', document.getElementById('permanent_city').value);
formData.append('permanent_post_office', document.getElementById('permanent_post_office').value);
formData.append('permanent_state', document.getElementById('permanent_state').value);
formData.append('permanent_district', document.getElementById('permanent_district').value);
formData.append('permanent_pincode', document.getElementById('permanent_pincode').value);

// Education Details
formData.append('educational_qualification', document.getElementById('educational_qualification').value);
formData.append('educational_qualification_division', document.getElementById('educational_qualification_division').value);
formData.append('intermediate_details', document.getElementById('intermediate_details').value);
formData.append('intermediate_details_division', document.getElementById('intermediate_details_division').value);
formData.append('high_school_details', document.getElementById('high_school_details').value);
formData.append('high_school_details_division', document.getElementById('high_school_details_division').value);

// Examination Details
formData.append('apply_for', document.getElementById('apply_for').value);
formData.append('examination_fees', document.getElementById('examination_fees').value);
formData.append('examination_centre_state', document.getElementById('examination_centre_state').value);
formData.append('examination_centre_city', document.getElementById('examination_centre_city').value);

// Other Details
formData.append('status', document.getElementById('status').value);
formData.append('_id', id); // Assuming `id` is already defined


    // const batchId = document.getElementById('batchId').value;
    // const application_number = document.getElementById('application_number').value;
    // const registration_number = document.getElementById('registration_number').value;
    // const first_name = document.getElementById('first_name').value;
    // const last_name = document.getElementById('last_name').value;
    // const father_husband_name = document.getElementById('father_husband_name').value;
    // const mother_name = document.getElementById('mother_name').value;
    // const date_of_birth = document.getElementById('date_of_birth').value;
    // const category = document.getElementById('category').value;
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
    // const status = document.getElementById('status').value;
    // const _id = id;
 
    const batchId = document.getElementById('batchId').value;
    const application_number = document.getElementById('application_number').value;
    const registration_number = document.getElementById('registration_number').value;
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const father_husband_name = document.getElementById('father_husband_name').value;
    const mother_name = document.getElementById('mother_name').value;
    const date_of_birth = document.getElementById('date_of_birth').value;
    const category = document.getElementById('category').value;
    // const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const gender = document.getElementById('gender').value;
    const marital_status = document.getElementById('marital_status').value;
    const photo_path = document.getElementById('photo_path').value;
    const present_house_no = document.getElementById('present_house_no').value;
    const present_village = document.getElementById('present_village').value;
    const present_city = document.getElementById('present_city').value;
    const present_post_office = document.getElementById('present_post_office').value;
    const present_state = document.getElementById('present_state').value;
    const present_district = document.getElementById('present_district').value;
    const present_pincode = document.getElementById('present_pincode').value;
    const permanent_street = document.getElementById('permanent_street').value;
    const permanent_house_no = document.getElementById('permanent_house_no').value;
    const permanent_village = document.getElementById('permanent_village').value;
    const permanent_city = document.getElementById('permanent_city').value;
    const permanent_post_office = document.getElementById('permanent_post_office').value;
    const permanent_state = document.getElementById('permanent_state').value;
    const permanent_district = document.getElementById('permanent_district').value;
    const permanent_pincode = document.getElementById('permanent_pincode').value;
    const educational_qualification = document.getElementById('educational_qualification').value;
    const educational_qualification_division = document.getElementById('educational_qualification_division').value;
    const intermediate_details = document.getElementById('intermediate_details').value;
    const intermediate_details_division = document.getElementById('intermediate_details_division').value;
    const high_school_details = document.getElementById('high_school_details').value;
    const high_school_details_division = document.getElementById('high_school_details_division').value;
    const apply_for = document.getElementById('apply_for').value;
    const examination_fees = document.getElementById('examination_fees').value;
    const examination_centre_state = document.getElementById('examination_centre_state').value;
    const examination_centre_city = document.getElementById('examination_centre_city').value;
    const status = document.getElementById('status').value;
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
                'Authorization': token
            },
            body: formData
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

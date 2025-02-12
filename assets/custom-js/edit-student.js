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
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const gender = document.getElementById('gender');
    const marital_status = document.getElementById('marital_status');
    const photo_path = document.getElementById('uploadPhoto');
    const presentHouseNo = document.getElementById('presentHouseNo');
    const present_village = document.getElementById('present_village');
    const present_city = document.getElementById('present_city');
    const presentPostOffice = document.getElementById('presentPostOffice');
    const present_state = document.getElementById('present_state');
    const presentDistrict = document.getElementById('presentDistrict');
    const present_pincode = document.getElementById('present_pincode');
    const permanent_street = document.getElementById('permanent_street');
    const permanentHouseNo = document.getElementById('permanentHouseNo');
    const permanent_village = document.getElementById('permanent_village');
    const permanent_city = document.getElementById('permanent_city');
    const permanent_post_office = document.getElementById('permanent_post_office');
    const permanent_state = document.getElementById('permanent_state');
    const permanent_district = document.getElementById('permanent_district');
    const permanent_pincode = document.getElementById('permanent_pincode');
    const educational_qualification = document.getElementById('educational_qualification');
    const educational_qualification_division = document.getElementById('educational_qualification_division');
    const intermediate_details = document.getElementById('intermediate_details');
    const intermediate_detailsDivision = document.getElementById('intermediate_detailsDivision');
    const highSchoolDetails = document.getElementById('highSchoolDetails');
    const highSchoolDetailsDivision = document.getElementById('highSchoolDetailsDivision');
    const apply_for = document.getElementById('apply_for');
    const examinationFee = document.getElementById('examinationFee');
    const examination_centre_state = document.getElementById('examination_centre_state');
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
        application_number.value = student.application_number || '';
    registration_number.value = student.registration_number || '';
    first_name.value = student.first_name || '';
    last_name.value = student.last_name || '';
    father_husband_name.value = student.father_husband_name || '';
    mother_name.value = student.mother_name || '';
    date_of_birth.value = student.date_of_birth || '';
    category.value = student.category || '';
    email.value = student.email || '';
    phone.value = student.phone || '';
    gender.value = student.gender || '';
    marital_status.value = student.marital_status || '';
    photo_path.value = student.photo_path || '';
    presentHouseNo.value = student.presentHouseNo || '';
    present_village.value = student.present_village || '';
    present_city.value = student.present_city || '';
    presentPostOffice.value = student.presentPostOffice || '';
    present_state.value = student.present_state || '';
    presentDistrict.value = student.presentDistrict || '';
    present_pincode.value = student.present_pincode || '';
    permanent_street.value = student.permanent_street || '';
    permanentHouseNo.value = student.permanentHouseNo || '';
    permanent_village.value = student.permanent_village || '';
    permanent_city.value = student.permanent_city || '';
    permanent_post_office.value = student.permanent_post_office || '';
    permanent_state.value = student.permanent_state || '';
    permanent_district.value = student.permanent_district || '';
    permanent_pincode.value = student.permanent_pincode || '';
    educational_qualification.value = student.educational_qualification || '';
    educational_qualification_division.value = student.educational_qualification_division || '';
    intermediate_details.value = student.intermediate_details || '';
    intermediate_detailsDivision.value = student.intermediate_detailsDivision || '';
    highSchoolDetails.value = student.highSchoolDetails || '';
    highSchoolDetailsDivision.value = student.highSchoolDetailsDivision || '';
    apply_for.value = student.apply_for || '';
    examinationFee.value = student.examinationFee || '';
    examination_centre_state.value = student.examination_centre_state || '';
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
    const application_number = document.getElementById('application_number').value;
    const registration_number = document.getElementById('registration_number').value;
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const father_husband_name = document.getElementById('father_husband_name').value;
    const mother_name = document.getElementById('mother_name').value;
    const date_of_birth = document.getElementById('date_of_birth').value;
    const category = document.getElementById('category').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const gender = document.getElementById('gender').value;
    const marital_status = document.getElementById('marital_status').value;
    const photo_path = document.getElementById('uploadPhoto').value;
    const presentHouseNo = document.getElementById('presentHouseNo').value;
    const present_village = document.getElementById('present_village').value;
    const present_city = document.getElementById('present_city').value;
    const presentPostOffice = document.getElementById('presentPostOffice').value;
    const present_state = document.getElementById('present_state').value;
    const presentDistrict = document.getElementById('presentDistrict').value;
    const present_pincode = document.getElementById('present_pincode').value;
    const permanent_street = document.getElementById('permanent_street').value;
    const permanentHouseNo = document.getElementById('permanentHouseNo').value;
    const permanent_village = document.getElementById('permanent_village').value;
    const permanent_city = document.getElementById('permanent_city').value;
    const permanent_post_office = document.getElementById('permanent_post_office').value;
    const permanent_state = document.getElementById('permanent_state').value;
    const permanent_district = document.getElementById('permanent_district').value;
    const permanent_pincode = document.getElementById('permanent_pincode').value;
    const educational_qualification = document.getElementById('educational_qualification').value;
    const educational_qualification_division = document.getElementById('educational_qualification_division').value;
    const intermediate_details = document.getElementById('intermediate_details').value;
    const intermediate_detailsDivision = document.getElementById('intermediate_detailsDivision').value;
    const highSchoolDetails = document.getElementById('highSchoolDetails').value;
    const highSchoolDetailsDivision = document.getElementById('highSchoolDetailsDivision').value;
    const apply_for = document.getElementById('apply_for').value;
    const examinationFee = document.getElementById('examinationFee').value;
    const examination_centre_state = document.getElementById('examination_centre_state').value;
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
            body: JSON.stringify({ batchId, application_number, registration_number, first_name, last_name, father_husband_name,mother_name,date_of_birth,category,email,phone,gender,marital_status,photo_path,presentHouseNo,present_village,present_city,presentPostOffice,present_state,presentDistrict,present_pincode,permanent_street,permanentHouseNo,permanent_village,permanent_city,permanent_post_office,permanent_state,permanent_district,permanent_pincode,educational_qualification, educational_qualification_division,intermediate_details,intermediate_detailsDivision,highSchoolDetails,highSchoolDetailsDivision,apply_for,examinationFee,examination_centre_state,examinationCenterCity,_id })
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

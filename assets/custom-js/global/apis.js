export const domain = 'http://localhost:5000';
import {} from './hide_unhide_ROLE.js';

// export const domain = 'https://backend-lms-yibk.onrender.com'

export const LIVE_CLASS_APP_ID = '3a55484f226043e18c5298242837f753';
// ---------------------END POINTS------------------------------
const admin = `/admin`
const user = `/user`;
const post = `/post`;
const getall = `/getAll`;
const get = `/get`;
const update = `/update`;
const role = `/role`
const course = `/course`
const courseCategory = `/courseCategory`
const batch = `/batch`
const batchCategory = `/batchCategory`
const student = `/student`
const classes = `/class`
// -----------------------------------------
export const TOKEN = localStorage.getItem("token");

//All APIs
const admin_API = `${domain}${admin}`;
const role_API = `${domain}${role}`
const user_API = `${domain}${user}`
const course_API =`${domain}${course}`
const course_category_API =`${domain}${courseCategory}`
const batch_API = `${domain}${batch}`
const batch_category_API = `${domain}${batchCategory}`
const student_API = `${domain}${student}`
export const delete_API = `${domain}/delete/all`;
export const import_API = `${domain}/import/student`;
export const EXPORT_API = `${domain}/export/data`  


const class_API = `${domain}${classes}`;
export const CLASS_GET_API = `${domain}${classes}${get}`;
export const CLASS_CREATE_API = `${domain}${classes}${post}`;
export const CLASS_GETALL_API = `${domain}${classes}${getall}`;
export const CLASS_UPDATE_API = `${domain}${classes}${update}`;

// ---------------User Log-In ----------------//
export const ADMIN_SIGNIN_API = `${admin_API}/login`;
export const ADMIN_SEND_OTP = `${admin_API}/sendOtpEmail`
export const ADMIN_VERIFY_OTP = `${admin_API}/verifyOtp`
export const ADMIN_RESET_PASSWORD = `${admin_API}/resetPassword`


export const STUDENT_SIGNIN_API = `${domain}/student/login`;


//ROLE APIs
export const ROLE_CREATE = `${role_API}${post}`
export const ROLE_GETALL_API = `${role_API}${getall}`
export const ROLE_GET_API = `${role_API}${get}`
export const ROLE_UPDATE_API = `${role_API}${update}`


//USER APIs
export const USER_CREATE_API = `${user_API}${post}`
export const USER_GETALL_API = `${user_API}${getall}`
export const USER_GET_API = `${user_API}${get}`
export const USER_UPDATE_API = `${user_API}${update}` 


//COURSE API
export const COURSE_CREATE_API = `${course_API}${post}`
export const COURSE_GETALL_API = `${course_API}${getall}`
export const COURSE_GET_API = `${course_API}${get}`
export const COURSE_UPDATE_API = `${course_API}${update}`


//COURSE Category API
export const COURSE_category_CREATE_API = `${course_category_API}${post}`
export const COURSE_category_GETALL_API = `${course_category_API}${getall}`
export const COURSE_category_GET_API = `${course_category_API}${get}`
export const COURSE_category_UPDATE_API = `${course_category_API}${update}`


//BATCH API batch batch
export const BATCH_CREATE_API = `${batch_API}${post}`
export const BATCH_GETALL_API = `${batch_API}${getall}`
export const BATCH_GET_API = `${batch_API}${get}`
export const BATCH_UPDATE_API = `${batch_API}${update}`


//BATCH Category API batch batch
export const BATCH_Category_CREATE_API = `${batch_category_API}${post}`
export const BATCH_Category_GETALL_API = `${batch_category_API}${getall}`
export const BATCH_Category_GET_API = `${batch_category_API}${get}`
export const BATCH_Category_UPDATE_API = `${batch_category_API}${update}`


// STUDENT API 
export const STUDENT_CREATE_API = `${student_API}${post}`
export const STUDENT_GETALL_API = `${student_API}${getall}`
export const STUDENT_GET_API = `${student_API}${get}`
export const STUDENT_UPDATE_API = `${student_API}${update}`
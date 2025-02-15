import { COURSE_GETALL_API, USER_GETALL_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================

let instructorList = [];
let coursesList = [];
let instructor_course_card = document.getElementById('instructor_course_card')
async function all_data_load_list(){
    try {
        loading_shimmer();
    } catch (error) {
        console.log(error);
    }
    try {
        const res = {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `${token}`
            }
        }
        //-------------------------------------------
        const api1 = fetch(`${USER_GETALL_API}`,res)
        const api2 = fetch(`${COURSE_GETALL_API}`,res)
        //-------------------------------------------

        // Await all fetch calls and parse JSON
        const [userRes, courseRes] = await Promise.all([
            fetch(USER_GETALL_API, res),
            fetch(COURSE_GETALL_API, res)
        ]);

        if (!userRes.ok || !courseRes.ok) {
            throw new Error('Error fetching data');
        }

        const userData = await userRes.json();
        const courseData = await courseRes.json();

        instructorList = userData?.data || null;
        coursesList = courseData?.courses || null;
        console.log('This is my User: ',instructorList)
        console.log('This is my Courses: ',coursesList);
    } catch (error) {
        console.log(error);
    }
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
all_data_load_list()
import { BATCH_GETALL_API, CLASS_CREATE_API, COURSE_category_GETALL_API, COURSE_GETALL_API, USER_GETALL_API } from './global/apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
const token = localStorage.getItem('token')
// ==============================================================================

let instructorList = [];
let batchList = [];
let courseCategoryList = [];
let courseList = [];
async function loadAllList(){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -------------------------------------------------------------------------------
    try {
        const ddd1 = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        };
        // ----------------------------------------------
        const api1 = fetch(`${USER_GETALL_API}`, ddd1);
        const api2 = fetch(`${BATCH_GETALL_API}`, ddd1);
        const api3 = fetch(`${COURSE_category_GETALL_API}`, ddd1);
        const api4 = fetch(`${COURSE_GETALL_API}`, ddd1);
        // -------------------------------------------------------------------------------

        // Await all fetch calls and parse JSON
        const responses = await Promise.all([api1, api2, api3, api4]);

        const [data1, data2, data3, data4] = await Promise.all(
            responses.map((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
        );

        instructorList = data1?.data || null;
        batchList = data2?.data || null;
        courseCategoryList = data3?.categories || null;
        courseList = data4?.courses || null;

    } catch (error) {
        console.error("Error occurred while fetching data:", error);
    }
    try{
        if(instructorList!=null || instructorList!=''){
            let aa1 = document.getElementById("selectInstructorList");
            let dd1 = instructorList.map((e)=>{
                if(e?.roles?.roles=="Instructor" || false){
                    return `<option value="${e?._id}" >${e?.firstName} ${e?.lastName} (${e?.userId})</option>`;
                }
            }).join("");
            aa1.innerHTML += dd1;
        }
    } catch (error){
        console.log(error);
    }
    try{
        if(batchList!=null || batchList!=''){
            let aa1 = document.getElementById("selectbatchList");
            let dd1 = batchList.map((e)=>{
                 return `<option value="${e?._id}" >${e?.batchId}</option>`;
            }).join("");
            aa1.innerHTML += dd1;
        }
    } catch (error){
        console.log(error);
    }
    try{
        if(courseCategoryList!=null || courseCategoryList!=''){
            let aa1 = document.getElementById("selectCourseCategoryList");
            let dd1 = courseCategoryList.map((e)=>{
                 return `<option value="${e?._id}" >${e?.categoryName}</option>`;
            }).join("");
            aa1.innerHTML += dd1;
        }
    } catch (error){
        console.log(error);
    }
    try{
        if(courseList!=null || courseList!=''){
            let aa1 = document.getElementById("selectCourseList");
            let dd1 = courseList.map((e)=>{
                 return `<option value="${e?._id}" >${e?.title}</option>`;
            }).join("");
            aa1.innerHTML += dd1;
        }
    } catch (error){
        console.log(error);
    }
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
loadAllList();
//==========================================================================================
//==========================================================================================
//==========================================================================================
let formclassLiveStreaming = document.getElementById("classLiveStreaming");
formclassLiveStreaming.addEventListener("submit", formSubmitLiveSession)
async function formSubmitLiveSession(event) {
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -------------------------------------------------------------------------------
    try{
        let formData = rtnObjDataForm();

        let API = `${CLASS_CREATE_API}`;
        const response = await fetch(API, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formData
        });

        let r1 = await response.json();

        localStorage.setItem("liveClassIdStart",r1?.class?._id);

        const c1 = (response.ok);
        try{
            status_popup( ((c1) ? "Class created <br> Successfully!" : "Please try <br> again later"), (c1) );
            setTimeout(function(){
                window.location.href = 'live-class.html';  
            },(10*1000));
        } catch (error){
            status_popup("Please try <br> again later", false);
        }            

    } catch(error){console.log(error)}
    // -------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}

function rtnObjDataForm(){
    let f = new FormData();
    f.append("classTitle", formclassLiveStreaming.querySelector("#BatchTitleName").value || '' );
    f.append("instructor", formclassLiveStreaming.querySelector("#selectInstructorList").value || '' );
    f.append("batch", formclassLiveStreaming.querySelector("#selectbatchList").value || '' );
    f.append("courseCategory", formclassLiveStreaming.querySelector("#selectCourseCategoryList").value || '' );
    f.append("course", formclassLiveStreaming.querySelector("#selectCourseList").value || '' );
    f.append("description", formclassLiveStreaming.querySelector("#descriptionLive").value || '' );
    
    let fileInput = formclassLiveStreaming.querySelector("#liveUpload");
    console.log(fileInput)
    if (fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
            f.append("materials", fileInput.files[i]);
        }
    }

    return f;
}


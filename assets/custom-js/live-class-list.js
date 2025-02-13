console.log("hello world")

// -----------------------------------------------------------------------------
const token = localStorage.getItem('token');
// -----------------------------------------------------------------------------
import { CLASS_GETALL_API } from "./global/apis.js";
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
// ==============================================================================
// ==============================================================================

async function loadAllList() {
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -------------------------------------------------------------------------------
    try{

        let API = `${CLASS_GETALL_API}`;
        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        });

        let r1 = await response.json();
        
        let data = r1?.data || null;
        let row;
        if(data!=null || data!=''){
            row = data.map(e => {
                return `
                    <tr>
                        <td><input type="checkbox" class="checkbox_child"></td>
                        <td>
                            <div class="flex-align gap-8"><a><span class="h6 mb-0 fw-medium text-gray-300">${e?.classTitle}</span></a></div>
                        </td>
                        <td><h6 class="m-0"><a class="text-hover text-gray-300">${e?.instructor?.first_name || ''} ${e?.instructor?.last_name || ''} (${e?.instructor?.userId || ''})</a></h6></td>
                        <td>
                            <span class="bg-success-50 text-bg-primary h6 mb-0 fw-medium text-gray-300 p-6 px-10 rounded-pill remark-three-dot-css-design" style="max-width: 200px !important;">${e?.course?.title || ''}</span>
                        </td>
                        <td><a class="text-hover text-gray-300">${e?.batch?.batchTitle} (${e?.batch?.batchId})</a></td>
                        <td><a class="text-hover text-gray-300"><span class="${e?.liveClassStatus == 'true' ? 'green' : 'red'}"></span></a></td>
                        <td><div>${e?.liveClassStatus == 'true' ? `<a class="bg-success text-white p-10 px-15 join-class form-alert" href="javascript:void(0)" style="border-radius:10px" onclick="classLoadView('${e?._id}')">Join Class</a>` : `<span class="bg-danger text-white p-10 px-28" style="border-radius:10px">Ended</span>`}</div></td>
                    </tr>
                `;
            }).join("");
        } else{
            row = `<tr><td colspan="7" class="text-center">Got error, please try again later!</td></tr>`;
        }

        document.getElementById("dynamicClassListTable").innerHTML = row;
    } catch (error){console.log(error)}
    // -------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
loadAllList();
// ==============================================================================================
// ==============================================================================================

window.classLoadView = function (__id){
    localStorage.setItem("liveClassIdStart", __id);
    window.location.href = 'current-live-class.html';


}











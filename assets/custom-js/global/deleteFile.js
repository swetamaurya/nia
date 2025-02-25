import { DELETE_FILE_API } from './apis.js'
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./loading_shimmer.js";
import { status_popup } from "./status_popup.js";
const token = localStorage.getItem('token')
export  function deleteFileGlobal(file,id){
    deletionFile(file,id)
}
async function deletionFile(files,ids){
    const fileName = files
        const _id = ids
        try {
            loading_shimmer();
        } catch (error) { console.log(error); }
        try {
            const API = `${DELETE_FILE_API}`;
            console.log('This is my get API: ', API);
    
            const response = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body:JSON.stringify({_id,fileName})
            });
            console.log('this is my response; ',response)
            if (!response.ok) {
                throw new Error("Failed to fetch data.");
            }
            const res = await response.json()
            try {
                document.getElementById(`${fileName}`).remove();
                status_popup(res?.message, response?.ok);
                remove_loading_shimmer()
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error)
        }

}

import { INSTRUCTOR_SIGNIN_API } from './global/apis.js'

try{
    localStorage.clear();
} catch(error){console.log(error)}
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
// ==============================================================================
// ==============================================================================
// console.log("INSTRUCTOR_SIGNIN_API :- ",INSTRUCTOR_SIGNIN_API)
let signIn = "sign-in-form";
document.getElementById(signIn).addEventListener("submit", async function (event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error);}
    // -----------------------------------------------------------------------------------
    try{
        const email = document.getElementById('fname').value;
        const password = document.getElementById('current-password').value;
        const API = `${INSTRUCTOR_SIGNIN_API}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `${TOKEN}`
            },
            body: JSON.stringify({ email, password }),
        });
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();
        console.log('THIS IS MY RESPONSE: ',r1)
        debugger;
        console.log(r1)
        let firstName = r1?.user?.first_name || ''
        let lastName = r1?.user?.last_name || '';
        let fullName = firstName + " " + lastName
        // -----------------------------------------------------------------------------------
        try{
            status_popup(r1?.message, (response?.ok));
            if(response?.ok) {
                try{
                    localStorage.setItem('token', r1?.token);
                    localStorage.setItem('roles', r1?.user?.roles?.roles);
                    localStorage.setItem('name', fullName);
                    localStorage.setItem('_id',  r1?.user?._id);
                    localStorage.setItem('email', r1?.user?.email);
                    localStorage.setItem('permissions',r1?.user?.roles?.permissions);

                    window.location.href = `live-class-list.html`
                } catch(error){
                    status_popup( ("please try again later, Server Error !"), (false));
                    console.log(error);
                }
            }
        } catch(error){console.log(error)}
    } catch(error){
        status_popup( ("Invalid Credentials"), (false));
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try{
        document.getElementById(signIn).reset();
        remove_loading_shimmer();
    } catch(error){console.log(error);}
});

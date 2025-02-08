import { ADMIN_RESET_PASSWORD } from './global/apis.js'

// try{
//     localStorage.clear();
// } catch(error){console.log(error)}
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
// ==============================================================================
// ==============================================================================

let resetPasswordForm = "reset-password-form";
let email1 = localStorage.getItem('email');
let currentOtp1 = localStorage.getItem('otp');
document.getElementById(resetPasswordForm).addEventListener("submit", async function (event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error);}
    // -----------------------------------------------------------------------------------
    try{
        const email = email1
        const currentOtp = currentOtp1
        const newPassword = document.getElementById('new-password').value.trim();
        
        const API = `${ADMIN_RESET_PASSWORD}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email,currentOtp,newPassword }),
        });
        debugger;
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();
        console.log('THIS IS MY RESPONSE: ',r1)
        // -----------------------------------------------------------------------------------
        try{
            status_popup(r1?.message, (response?.ok));
            if(response?.ok) {
                try{
                    window.location.href = `sign-in.html`
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
        document.getElementById(resetPasswordForm).reset();
        remove_loading_shimmer();
    } catch(error){console.log(error);}
});

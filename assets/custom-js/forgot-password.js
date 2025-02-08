import { ADMIN_SEND_OTP } from './global/apis.js'

try{
    localStorage.clear();
} catch(error){console.log(error)}
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
// ==============================================================================
// ==============================================================================

let forgotPasswordForm = "forgot-password-form";
document.getElementById(forgotPasswordForm).addEventListener("submit", async function (event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error);}
    // -----------------------------------------------------------------------------------
    try{
        const email = document.getElementById('email').value.trim();
        const API = `${ADMIN_SEND_OTP}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }),
        });
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();
        console.log('THIS IS MY RESPONSE: ',r1)
        // -----------------------------------------------------------------------------------
        try{
            status_popup(r1?.message, (response?.ok));
            if(response?.ok) {
                try{
                    localStorage.setItem('email',email);
                    window.location.href = `verification.html`
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
        document.getElementById(forgotPasswordForm).reset();
        remove_loading_shimmer();
    } catch(error){console.log(error);}
});

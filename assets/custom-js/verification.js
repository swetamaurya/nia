


if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
  }
import { ADMIN_VERIFY_OTP } from './global/apis.js'

// try{
//     localStorage.clear();
// } catch(error){console.log(error)}
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
// ==============================================================================
// ==============================================================================

let verificationForm = "verification-form";
let email = localStorage.getItem('email');
document.getElementById(verificationForm).addEventListener("submit", async function (event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error);}
    // -----------------------------------------------------------------------------------
    try{
        const input1 = document.getElementById('input1').value.trim();
        const input2 = document.getElementById('input2').value.trim();
        const input3 = document.getElementById('input3').value.trim();
        const input4 = document.getElementById('input4').value.trim();
        const input5 = document.getElementById('input5').value.trim();
        const input6 = document.getElementById('input6').value.trim();
        // const email = 
        const currentOtp = input1+input2+input3+input4+input5+input6
        const API = `${ADMIN_VERIFY_OTP}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email,currentOtp }),
        });
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();
        console.log('THIS IS MY RESPONSE: ',r1)
        // -----------------------------------------------------------------------------------
        try{
            status_popup(r1?.message, (response?.ok));
            if(response?.ok) {
                try{
                    localStorage.setItem('otp',currentOtp);
                    window.location.href = `reset-password.html`
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
        document.getElementById(verificationForm).reset();
        remove_loading_shimmer();
    } catch(error){console.log(error);}
});

import { ADMIN_SIGNIN_API } from './global/apis.js'

try{
    localStorage.clear();
} catch(error){console.log(error)}
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
// ==============================================================================
// ==============================================================================

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
        const API = `${ADMIN_SIGNIN_API}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();
        console.log('THIS IS MY RESPONSE: ',r1)
        console.log(r1)
        // -----------------------------------------------------------------------------------
        try{
            status_popup(r1?.message, (response?.ok));
            if(response?.ok) {
                try{
                    localStorage.setItem('token', r1?.token);
                    localStorage.setItem('roles', r1?.admin?.roles);
                    localStorage.setItem('name', r1?.admin?.name);
                    localStorage.setItem('_id', r1?.admin?._id);
                    localStorage.setItem('email',r1?.admin?.email);
                    localStorage.setItem('permissions',r1?.admin?.permissions);
                    localStorage.setItem('roles', r1?.admin?.roles)
                    localStorage.setItem('image', r1?.admin?.image)

                    window.location.href = `index-2.html`
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

// (function(){
//     const timestamp = localStorage.getItem('timestampActiveSession');
//     if (timestamp) {
//         const currentTime = Date.now();
//         const timeDiff = currentTime - parseInt(timestamp);
//         let hrs = 9.5; // hrs session active condition
//         if (timeDiff > hrs * 60 * 60 * 1000) {
//             localStorage.clear();
//             window.location.href = 'login.html';
//         }
//     } else {
//         localStorage.clear();
//         window.location.href = 'login.html';
//     }
// })();

export function start_hidder(){
    main_hidder_function();
}
console.log("brothelrkj a;lksjdsdf aslkjdjf lk")
function main_hidder_function(){
    let role_of_user = localStorage.getItem("roles") || "null";
    if(role_of_user.toLowerCase() == "students".toLowerCase () || role_of_user.includes("student")){
        admin_restriction_d_none();
        admin_restriction_disabled();
    }
}
main_hidder_function();
setTimeout(() => {
    main_hidder_function();
}, 100);
setTimeout(() => {
    main_hidder_function();
}, 500);
setTimeout(() => {
    main_hidder_function();
}, 1000);
setTimeout(() => {
    main_hidder_function();
}, 5000);
// =========================================================================================
// copy and paste admin class, to hide other functionalty for admin;
function admin_restriction_d_none(){
    let all = Array.from(document.querySelectorAll(".admin_restriction_d_none"));
    all.map((e)=>{
        e.style.setProperty('display', 'none', 'important');
        e.classList.add("d-none", "hidden");
        e.setAttribute("hidden","");
    });
}
// =========================================================================================
// copy and paste admin class, to disabled other functionalty for admin;
function admin_restriction_disabled(){
    let all = Array.from(document.querySelectorAll(".admin_restriction_disabled"));
    all.map((e)=>{
        e.setAttribute("disabled","");
        e.setAttribute("readonly","");
    });
}
// $(document).ready(function () {
//     // Load header
//     $('#header-placeholder').load('header.html');
//     $('#sidebar-placeholder').load('sidebar.html');
//     $('#footer-placeholder').load('footer.html');
//   });
let sidebarArr = {
    "Admin": "admin-sidebar.html",
    "Instructor": "instructor-sidebar.html", 
    "Students": "student-sidebar.html",
    "User": "sidebar.html" 
};


function loadContent(url, placeholderId, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log('data: ',data)
            document.getElementById(placeholderId).innerHTML = data;
            if (callback) callback();
        });
}

const userRole = localStorage.getItem("roles") || "Guest";

// Select the correct sidebar
const sidebarToLoad = sidebarArr[userRole] || "sidebar.html"; 

// Load the sidebar
loadContent(sidebarToLoad, "sidebar-placeholder");

loadContent('header.html', 'header-placeholder',initializeUser);
loadContent('footer.html', 'footer-placeholder');

function initializeUser() {
    // let adminProfilePage = document.getElementById('adminProfilePage')
    let userName = document.getElementById('userName');
    let userEmail = document.getElementById('userEmail');
    let userRoles = document.getElementById('roles');
    let profilePhoto = document.getElementById('profilePhoto')


    if (!userName || !userEmail) {
        console.error("User elements not found!");
        return;
    }

    console.log("User elements found:", userName, userEmail);


    const name = localStorage.getItem("name") || "Guest";
    const email = localStorage.getItem("email") || "guest@example.com";
    const roles = localStorage.getItem("roles") || "Guest";
    const image = localStorage.getItem("image") || "assets/images/thumbs/user-img.png"
    const id = localStorage.getItem("_id")
//add id and redirect to admin profile page
    // adminProfilePage.innerHTML=`<a href="admin-profile.html?id=${id}"
    //                             class="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15">
    //                             <span class="text-2xl text-primary-600 d-flex"><i class="ph ph-gear"></i></span>
    //                             <span class="text">Profile</span>
    //                         </a>`

    userRoles.style.paddingLeft = '8px';

    userName.innerText = name;
    userEmail.innerText = email;
    userRoles.innerText = roles
    profilePhoto.src = image;
}
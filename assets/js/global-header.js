// $(document).ready(function () {
//     // Load header
//     $('#header-placeholder').load('header.html');
//     $('#sidebar-placeholder').load('sidebar.html');
//     $('#footer-placeholder').load('footer.html');
//   });
let sidebarArr = {
    "Admin": "admin-sidebar.html",
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 05e0dee682bd9ae14b01bf84603d7529997ea935
    "Instructor": "instructor-sidebar.html",
    "HR": "sidebar.html",
    "Manager": "sidebar.html",
    "Students": "student-sidebar.html",
<<<<<<< HEAD
=======
=======
    "Instructor": "instructor-sidebar.html", 
    "Students": "student-sidebar.html",
    "User": "sidebar.html" 
>>>>>>> 82fd20aeb23f6465758f355f0eaaef2508afb39a
>>>>>>> 05e0dee682bd9ae14b01bf84603d7529997ea935
};


function loadContent(url, placeholderId, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
<<<<<<< HEAD
            console.log('url: ', url)
=======
<<<<<<< HEAD
            console.log('url: ', url)
=======
            console.log('data: ',data)
>>>>>>> 82fd20aeb23f6465758f355f0eaaef2508afb39a
>>>>>>> 05e0dee682bd9ae14b01bf84603d7529997ea935
            document.getElementById(placeholderId).innerHTML = data;
            if (callback) callback();
        });
}

const userRole = localStorage.getItem("roles") || "Guest";

// Select the correct sidebar
<<<<<<< HEAD
const sidebarToLoad = sidebarArr[userRole] || "sidebar.html";
=======
<<<<<<< HEAD
const sidebarToLoad = sidebarArr[userRole] || "sidebar.html";
=======
const sidebarToLoad = sidebarArr[userRole] || "sidebar.html"; 
>>>>>>> 82fd20aeb23f6465758f355f0eaaef2508afb39a
>>>>>>> 05e0dee682bd9ae14b01bf84603d7529997ea935

// Load the sidebar
loadContent(sidebarToLoad, "sidebar-placeholder");

<<<<<<< HEAD
loadContent('header.html', 'header-placeholder', initializeUser);
=======
<<<<<<< HEAD
loadContent('header.html', 'header-placeholder', initializeUser);
=======
loadContent('header.html', 'header-placeholder',initializeUser);
>>>>>>> 82fd20aeb23f6465758f355f0eaaef2508afb39a
>>>>>>> 05e0dee682bd9ae14b01bf84603d7529997ea935
loadContent('footer.html', 'footer-placeholder');

function initializeUser() {
    // let adminProfilePage = document.getElementById('adminProfilePage')
    let userName = document.getElementById('userName');
    let userEmail = document.getElementById('userEmail');
    let userRoles = document.getElementById('roles');
    let profilePhoto = document.getElementById('profilePhoto')
    let profilePage = document.getElementById('profilePage')

    


    if (!userName || !userEmail) {
        console.error("User elements not found!");
        return;
    }

    console.log("User elements found:", userName, userEmail);


    const name = localStorage.getItem("name") || "Guest";
    const email = localStorage.getItem("email") || "guest@example.com";
    const roles = localStorage.getItem("roles") || "Guest";
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 05e0dee682bd9ae14b01bf84603d7529997ea935
    const image = localStorage.getItem("image") || "assets/images/thumbs/dummy-profile-pic.png"
    const id = localStorage.getItem("_id")

    // for (let key in sidebarArr) {
    //     if (roles == 'Instructor') {
    //         profilePage.innerHTML = `<a href="profile.html?id=${id}" 
    //         class="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 
    //         fw-medium text-15">
    //           <span class="text-2xl text-primary-600 d-flex"><i class="ph ph-gear"></i></span>
    //             <span class="text">Profile</span>
    //         </a>`
    //     }
    //     else if (roles == 'Students') {
    //         profilePage.innerHTML = `<a href="student-profile.html?id=${id}" 
    //         class="py-12 text-15 px-20 bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 
    //         fw-medium text-15">
    //           <span class="text-2xl text-primary-600 d-flex"><i class="ph ph-gear"></i></span>
    //             <span class="text">Profile</span>
    //         </a>`
    //     }
    //     else if (roles == 'Admin' || roles == 'Manager' || roles == 'HR') {
    //         profilePage.innerHTML = `<a href="profile.html?id=${id}" 
    //         class="py-12 text-15 px-20 bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 
    //         fw-medium text-15">
    //           <span class="text-2xl text-primary-600 d-flex"><i class="ph ph-gear"></i></span>
    //             <span class="text">Profile</span>
    //         </a>`
    //     }
    // }
    if (roles == 'Students') {
        profilePage.innerHTML = `<a href="student-profile.html?id=${id}"
        class="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8
        fw-medium text-15">
          <span class="text-2xl text-primary-600 d-flex"><i class="ph ph-gear"></i></span>
            <span class="text">Profile</span>
        </a>`
    }
    else if (roles == 'Admin' || roles == 'Manager' || roles == 'HR' || roles == 'Instructor') {
        profilePage.innerHTML = `<a href="profile.html?id=${id}"
        class="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8
        fw-medium text-15">
          <span class="text-2xl text-primary-600 d-flex"><i class="ph ph-gear"></i></span>
            <span class="text">Profile</span>
        </a>`
    }
<<<<<<< HEAD
=======
=======
    const image = localStorage.getItem("image") || "assets/images/thumbs/user-img.png"
    const id = localStorage.getItem("_id")
//add id and redirect to admin profile page
    // adminProfilePage.innerHTML=`<a href="admin-profile.html?id=${id}"
    //                             class="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15">
    //                             <span class="text-2xl text-primary-600 d-flex"><i class="ph ph-gear"></i></span>
    //                             <span class="text">Profile</span>
    //                         </a>`
>>>>>>> 82fd20aeb23f6465758f355f0eaaef2508afb39a
>>>>>>> 05e0dee682bd9ae14b01bf84603d7529997ea935

    userRoles.style.paddingLeft = '8px';
    userRoles.style.color = '#000000';

    userName.innerText = name;
    userEmail.innerText = email;
    userRoles.innerText = roles
    profilePhoto.src = image;
}
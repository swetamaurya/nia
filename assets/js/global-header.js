// $(document).ready(function () {
//     // Load header
//     $('#header-placeholder').load('header.html');
//     $('#sidebar-placeholder').load('sidebar.html');
//     $('#footer-placeholder').load('footer.html');
//   });


function loadContent(url, placeholderId, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(placeholderId).innerHTML = data;
            if (callback) callback();
        });
}

// Load sidebar, header, and footer
loadContent('sidebar.html', 'sidebar-placeholder');
loadContent('header.html', 'header-placeholder',initializeUser);
loadContent('footer.html', 'footer-placeholder');

function initializeUser() {
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

    userRoles.style.paddingLeft = '8px';

    userName.innerText = name;
    userEmail.innerText = email;
    userRoles.innerText = roles
    profilePhoto.src = image;
}
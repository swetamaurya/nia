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

    if (!userName || !userEmail) {
        console.error("User elements not found!");
        return;
    }

    console.log("User elements found:", userName, userEmail);


    const name = localStorage.getItem("name") || "Guest";
    const email = localStorage.getItem("email") || "guest@example.com";

    userName.innerText = name;
    userEmail.innerText = email;
}
// $(document).ready(function () {
//     // Load header
//     $('#header-placeholder').load('header.html');
//     $('#sidebar-placeholder').load('sidebar.html');
//     $('#footer-placeholder').load('footer.html');
//   });


function loadContent(url, placeholderId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(placeholderId).innerHTML = data;
        });
}

// Load sidebar, header, and footer
loadContent('sidebar.html', 'sidebar-placeholder');
loadContent('header.html', 'header-placeholder');
loadContent('footer.html', 'footer-placeholder');

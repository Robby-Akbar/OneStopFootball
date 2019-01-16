document.addEventListener("DOMContentLoaded", function() {
    // Activate sidebar nav
    let elems = document.querySelectorAll(".tabs");
    M.Sidenav.init(elems);
    loadTab();

    function loadTab() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status !== 200) return;

                // Muat daftar tautan tab
                document.querySelectorAll(".tabs").forEach(function(elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                // Daftarkan event listener untuk setiap tautan tab
                document.querySelectorAll(".tabs a").forEach(function(elm) {
                    elm.addEventListener("click", function(event) {
                        // Muat konten halaman yang dipanggil
                        page = event.target.getAttribute("href").substr(1);
                        if (page ==="team"){

                        } else if (page === "match"){

                        }
                        loadPage(page);
                    });
                });
            }
        };
        xhttp.open("GET", "tab.html", true);
        xhttp.send();
    }

    // Load page content
    let page = window.location.hash.substr(1);
    if (page === "") page = "team";
    loadPage(page);

    function loadPage(page) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                let content = document.querySelector("#body-content");
                if (this.status === 200) {
                    content.innerHTML = xhttp.responseText;
                } else if (this.status === 404) {
                    content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                } else {
                    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
                }
            }
        };
        xhttp.open("GET", "tabs/" + page + ".html", true);
        xhttp.send();
    }
});
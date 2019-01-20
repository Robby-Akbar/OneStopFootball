let base_url = "https://api.football-data.org/v2/";
let API_KEY = "20784e3c685f40d0ababea46d326592d";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getTeams() {

    if ('caches' in window) {
        caches.match(base_url + "competitions/2021/standings?standingType=TOTAL").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    let tablesHTML = "";
                    data.standings[0].table.forEach(function (table) {
                        tablesHTML += `
                        <div class="card">
                          <a href="./team.html?id=${table.team.id}">
                            <div class="card-image waves-effect waves-block waves-light">
                              <img src="${table.team.crestUrl}" alt="Logo Team" height="200" style="object-fit: cover;"/>
                            </div>
                          </a>
                          <div class="card-content">
                            <span class="card-title truncate">${table.team.name}</span>
                            <p>Points : ${table.points} | Played Games : ${table.playedGames} | Won : ${table.won}</p>
                          </div>
                        </div>
                    `;
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("teams").innerHTML = tablesHTML;
                })
            }
        })
    }

    fetch(base_url + "competitions/2021/standings?standingType=TOTAL", {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            // Objek/array JavaScript dari response.json() masuk lewat data.
            // Menyusun komponen card team secara dinamis
            let tablesHTML = "";
            data.standings[0].table.forEach(function (table) {
                tablesHTML += `
              <div class="card">
                <a href="./team.html?id=${table.team.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${table.team.crestUrl}" alt="Logo Team" height="200" style="object-fit: cover;"/>
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${table.team.name}</span>
                  <p>Points : ${table.points} | Played Games : ${table.playedGames} | Won : ${table.won}</p>
                </div>
              </div>
            `;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("teams").innerHTML = tablesHTML;
        })
        .catch(error);
}

function getTeamById() {

    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    if ('caches' in window) {
        caches.match(base_url + "teams/" + idParam).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    document.getElementById("body-content").innerHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" alt="Logo Team" height="300" style="object-fit: cover;"/>
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
              <b>Address : </b>${data.address}<br>
              <b>Club Color : </b>${data.clubColors}<br>
              <b>E-mail : </b>${data.email}<br>
              <b>Address : </b>${data.address}<br>
              <b>Phone : </b>${data.phone}<br>
              <b>Short Name : </b>${data.shortName}<br>
              <b>Venue : </b>${data.venue}<br>
              <b>Website : </b>${data.website}<br>
              <h5>Squad</h5>
                <div id="squads">
                </div><br>
                <div class="card-action">
                    <button class="btn cyan waves-effect waves-light right" id='btnAdd' type="submit" value="Add">Add to Favorite</button>
                </div>
            </div>
          </div>
        `;

                    let squadsHTML = "";
                    data.squad.forEach(function (squad) {
                        squadsHTML += `
                ${squad.name} : <b>${squad.position}</b> - ${squad.nationality}<br>
            `;
                    });
                    document.getElementById("squads").innerHTML = squadsHTML;

                })
            }
        })
    }

    fetch(base_url + "teams/" + idParam, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" alt="Logo Team" height="300" style="object-fit: cover;"/>
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
              <b>Address : </b>${data.address}<br>
              <b>Club Color : </b>${data.clubColors}<br>
              <b>E-mail : </b>${data.email}<br>
              <b>Address : </b>${data.address}<br>
              <b>Phone : </b>${data.phone}<br>
              <b>Short Name : </b>${data.shortName}<br>
              <b>Venue : </b>${data.venue}<br>
              <b>Website : </b>${data.website}<br>
              <h5>Squad</h5>
                <div id="squads">
                </div><br>
                <div class="card-action">
                    <button class="btn cyan waves-effect waves-light right" id='btnAdd' type="submit" value="Add">Add to Favorite</button>
                </div>
            </div>
          </div>
        `;
            let btnAdd = document.getElementById("btnAdd");
            btnAdd.onclick = function () {
                createFavorite("team",data);
            };
            let squadsHTML = "";
            data.squad.forEach(function (squad) {
                squadsHTML += `
                ${squad.name} : <b>${squad.position}</b> - ${squad.nationality}<br>
            `;
            });
            document.getElementById("squads").innerHTML = squadsHTML;
        })
        .catch(error);
}

function getMatches() {

    if ('caches' in window) {
        caches.match(base_url + "competitions/2021/matches?status=SCHEDULED").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    let matchesHTML = "";
                    if (data.count===0){
                        document.getElementById("matches").innerHTML = `<p>Tidak ada jadwal pertandingan</p>`;
                    } else{
                        let match = data.matches;
                        for (let i = 0;i<20;i++) {
                            let date = match[i].utcDate.split("T");
                            let time = date[1].split("Z");
                            matchesHTML += `
        <div class="card">
            <div class="card-content">
                <span class="card-title truncate">Premier League</span><br>
                ${match[i].group}
                <table border="0" width="100%">
                    <tr>
                        <td width="45%" class="left-align">${match[i].awayTeam.name}</td>
                        <td width="10%"><b>VS</b></td>
                        <td width="45%" class="right-align">${match[i].homeTeam.name}</td>
                    </tr>
                </table>
                <h6 class="left-align"><b>Date : </b>${date[0]}</h6>
                <h6 class="left-align"><b>Time : </b>${time[0]}</h6>
                <h6 class="left-align"><b>Status : </b>${match[i].status}</h6>
            </div>
            <div class="card-action">
                <a href="#">Add to Favorite</a>
            </div>
        </div>
                `;
                        }
                        document.getElementById("matches").innerHTML = matchesHTML;
                    }
                })
            }
        })
    }

    fetch(base_url + "competitions/2021/matches?status=SCHEDULED", {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            let matchesHTML = "";
            if (data.count===0){
                document.getElementById("matches").innerHTML = `<p>Tidak ada jadwal pertandingan</p>`;
            } else {
                let match = data.matches;
                for (let i = 0;i<20;i++){
                    let date = match[i].utcDate.split("T");
                    let time = date[1].split("Z");
                    matchesHTML += `
        <div class="card">
            <div class="card-content">
                <span class="card-title truncate">Premier League</span><br>
                ${match[i].group}
                <table border="0" width="100%">
                    <tr>
                        <td width="45%" class="left-align">${match[i].awayTeam.name}</td>
                        <td width="10%"><b>VS</b></td>
                        <td width="45%" class="right-align">${match[i].homeTeam.name}</td>
                    </tr>
                </table>
                <h6 class="left-align"><b>Date : </b>${date[0]}</h6>
                <h6 class="left-align"><b>Time : </b>${time[0]}</h6>
                <h6 class="left-align"><b>Status : </b>${match[i].status}</h6>
            </div>
            <div class="card-action">
                <a href="#">Add to Favorite</a>
            </div>
        </div>
                `;
                }
                document.getElementById("matches").innerHTML = matchesHTML;
            }
        })
        .catch(error);

}

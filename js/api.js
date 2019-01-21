let base_url = "https://api.football-data.org/v2/";
let API_KEY = "20784e3c685f40d0ababea46d326592d";

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}
function json(response) {
    return response.json();
}
function error(error) {
    console.log("Error : " + error);
}

function getTeams() {
    if ('caches' in window) {
        caches.match(base_url + "competitions/2021/standings?standingType=TOTAL").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    viewTeams(data);
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
            viewTeams(data);
        })
        .catch(error);
}

function viewTeams(data) {
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
    document.getElementById("teams").innerHTML = tablesHTML;
}

function viewTeamsFavorite(data) {
    let teamsHTML = "";
    if (data.count===0){
        M.toast({
            html: 'Favorite is empty!'
        });
    } else {
        data.forEach(function (team) {
            teamsHTML += `
            <div class="center">
                <div class="col s12 m7" id="team">
                    <div class="card">
                        <a href="./team.html?id=${team.id}">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${team.crestUrl}" alt="Logo Team" height="200" style="object-fit: cover;"/>
                            </div>
                        </a>
                        <div class="card-content">
                            <span class="card-title truncate">${team.name}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        document.getElementById("body-content").innerHTML = teamsHTML;
    }
}

function getTeamById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    let id = Number(idParam);
    if ('caches' in window) {
        caches.match(base_url + "teams/" + idParam).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    viewTeam(data,id);
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
            viewTeam(data,id);
        })
        .catch(error);
}

function viewTeam(data,id) {
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
            <div id="squads"></div>
        </div>
    </div>
    <div class="fixed-action-btn">
        <a class="btn-floating btn-large green accent-4">
            <i id="btnAdd" class="large material-icons">favorite_border</i>
        </a>
    </div>
    `;
    let squadsHTML = "";
    data.squad.forEach(function (squad) {
        squadsHTML += `
            ${squad.name} : <b>${squad.position}</b> - ${squad.nationality}<br>
        `;
    });
    document.getElementById("squads").innerHTML = squadsHTML;
    let isFavorite = false;
    favoriteState("favorite_team",id).then((message)=>{
        console.log("Favorite : " + message);
        document.getElementById("btnAdd").innerHTML = "favorite";
        isFavorite = true;
    }).catch((message)=>{
        console.log("Favorite : " + message);
        document.getElementById("btnAdd").innerHTML = "favorite_border";
        isFavorite = false;
    });
    let btnAdd = document.getElementById("btnAdd");
    btnAdd.onclick = function () {
        if (isFavorite) {
            deleteFavorite("favorite_team",id);
            isFavorite = false;
        } else {
            createFavorite("team",data);
            isFavorite = true;
        }
    };
}

function getMatches() {
    if ('caches' in window) {
        caches.match(base_url + "competitions/2021/matches?status=SCHEDULED").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    viewMatches(data);
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
            viewMatches(data);
        })
        .catch(error);
}

function viewMatches(data) {
    let matchesHTML = "";
    if (data.count===0){
        document.getElementById("matches").innerHTML = `<p>Tidak ada jadwal pertandingan</p>`;
    } else {
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
                    <a href="./match.html?id=${match[i].id}">Click to Detail</a>
                </div>
            </div>
            `;
        }
        document.getElementById("matches").innerHTML = matchesHTML;
    }
}

function viewMatchesFavorite(data) {
    let matchesHTML = "";
    if (data.count===0){
        M.toast({
            html: 'Favorite is empty!'
        });
    } else {
        data.forEach(function (data) {
            let date = data.match.utcDate.split("T");
            let time = date[1].split("Z");
            matchesHTML += `
            <div class="center">
                <div class="col s12 m7" id="match">
                    <div class="card">
                        <div class="card-content">
                            <span class="card-title truncate">Premier League</span><br>
                            ${data.match.group}
                            <table border="0" width="100%">
                                <tr>
                                    <td width="45%" class="left-align">${data.match.awayTeam.name}</td>
                                    <td width="10%"><b>VS</b></td>
                                    <td width="45%" class="right-align">${data.match.homeTeam.name}</td>
                                </tr>
                            </table>
                            <h6 class="left-align"><b>Date : </b>${date[0]}</h6>
                            <h6 class="left-align"><b>Time : </b>${time[0]}</h6>
                            <h6 class="left-align"><b>Status : </b>${data.match.status}</h6>
                        </div>
                        <div class="card-action">
                            <a href="./match.html?id=${data.match.id}">Click to Detail</a>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        document.getElementById("body-content").innerHTML = matchesHTML;
    }
}

function getMatchById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    let id = Number(idParam);
    if ('caches' in window) {
        caches.match(base_url + "matches/" + idParam).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    viewMatch(data,id);
                })
            }
        })
    }
    fetch(base_url + "matches/" + idParam, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            viewMatch(data,id);
        }).catch(error);
}

function viewMatch(data,id) {
    let match = data.match;
    let h2h = data.head2head;
    let date = match.utcDate.split("T");
    let time = date[1].split("Z");
    document.getElementById("body-content").innerHTML = `
    <div class="center">
        <div class="col s12 m7">
            <div class="card">
                <div class="card-content">
                    <span class="card-title truncate">Premier League</span><br>
                    ${match.group}
                    <table border="0" width="100%">
                        <tr>
                            <td width="45%" class="left-align">${match.awayTeam.name}</td>
                            <td width="10%" class="center"><b>VS</b></td>
                            <td width="45%" class="right-align">${match.homeTeam.name}</td>
                        </tr>
                        <tr>
                            <td width="45%" class="left-align">${h2h.awayTeam.wins}</td>
                            <td width="10%" class="center"><b>Wins</b></td>
                            <td width="45%" class="right-align">${h2h.homeTeam.wins}</td>
                        </tr>
                        <tr>
                            <td width="45%" class="left-align">${h2h.awayTeam.draws}</td>
                            <td width="10%" class="center"><b>Draws</b></td>
                            <td width="45%" class="right-align">${h2h.homeTeam.draws}</td>
                        </tr>
                        <tr>
                            <td width="45%" class="left-align">${h2h.awayTeam.losses}</td>
                            <td width="10%" class="center"><b>Losses</b></td>
                            <td width="45%" class="right-align">${h2h.homeTeam.losses}</td>
                        </tr>
                    </table>
                    <h6 class="left-align"><b>Number of Matches : </b>${h2h.numberOfMatches}</h6>
                    <h6 class="left-align"><b>Total Goals : </b>${h2h.totalGoals}</h6>
                    <h6 class="left-align"><b>Date : </b>${date[0]}</h6>
                    <h6 class="left-align"><b>Time : </b>${time[0]}</h6>
                    <h6 class="left-align"><b>Status : </b>${match.status}</h6>
                </div>
            </div>
            <div class="fixed-action-btn">
                <a class="btn-floating btn-large green accent-4">
                    <i id="btnAdd" class="large material-icons">favorite_border</i>
                </a>
            </div>
        </div>
    </div>
    `;
    let isFavorite = false;
    favoriteState("favorite_match",id).then((message)=>{
        console.log("Favorite : " + message);
        document.getElementById("btnAdd").innerHTML = "favorite";
        isFavorite = true;
    }).catch((message)=>{
        console.log("Favorite : " + message);
        document.getElementById("btnAdd").innerHTML = "favorite_border";
        isFavorite = false;
    });
    let btnAdd = document.getElementById("btnAdd");
    btnAdd.onclick = function () {
        if (isFavorite) {
            deleteFavorite("favorite_match",id);
            isFavorite = false;
        } else {
            createFavorite("match",data);
            isFavorite = true;
        }
    };
}

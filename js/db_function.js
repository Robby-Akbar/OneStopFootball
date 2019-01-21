function favoriteState(storeName, id) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                let tx = db.transaction(storeName, "readonly");
                return tx.objectStore(storeName).get(id);
            })
            .then(function (data) {
                if (data !== undefined) {
                    resolve("Yes")
                } else {
                    reject("No")
                }
            });
    });
}

function createFavorite(type, data) {
    let storeName = "";
    let item = {};
    if (type === "team") {
        storeName = "favorite_team";
        item = {
            id: data.id,
            name: data.name,
            shortName: data.shortName,
            tla: data.tla,
            crestUrl: data.crestUrl,
            address: data.address,
            phone: data.phone,
            website: data.website,
            email: data.email,
            clubColors: data.clubColors,
            venue: data.venue,
            squad: data.squad
        }
    } else if (type === "match"){
        storeName = "favorite_match";
        item = {
            id: data.match.id,
            head2head: {
                numberOfMatches: data.head2head.numberOfMatches,
                totalGoals: data.head2head.totalGoals,
                homeTeam: {
                    wins: data.head2head.homeTeam.wins,
                    draws: data.head2head.homeTeam.draws,
                    losses: data.head2head.homeTeam.losses
                },
                awayTeam: {
                    wins: data.head2head.awayTeam.wins,
                    draws: data.head2head.awayTeam.draws,
                    losses: data.head2head.awayTeam.losses
                }
            },
            match: {
                utcDate: data.match.utcDate,
                venue: data.match.venue,
                matchday: data.match.matchday,
                homeTeam: {
                    name: data.match.homeTeam.name
                },
                awayTeam: {
                    name: data.match.awayTeam.name
                }
            }
        }
    }
    databasePromise(idb).then(db => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(item);
        return tx.complete;
    }).then(function () {
        document.getElementById("btnAdd").innerHTML = "favorite";
        M.toast({
            html: 'Added to Favorite!'
        });
    }).catch(function () {
        M.toast({
            html: 'Something went wrong'
        });
    });
}

function showFavorite(storeName) {
    return new Promise(function (resolve) {
        databasePromise(idb)
            .then(function (db) {
                let tx = db.transaction(storeName, "readonly");
                return tx.objectStore(storeName).getAll();
            })
            .then(function (data) {
                resolve(data);
            });
    });
}


function deleteFavorite(storeName, data) {
    databasePromise(idb).then(function (db) {
        let tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).delete(data);
        return tx.complete;
    }).then(function () {
        document.getElementById("btnAdd").innerHTML = "favorite_border";
        M.toast({
            html: 'Removed from Favorite!'
        });
    }).catch(function () {
        M.toast({
            html: 'Something went wrong'
        });
    });
}

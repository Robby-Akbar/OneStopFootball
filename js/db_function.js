import * as M from "./materialize";
import {databasePromise} from "./db";

export function createFavorite(type, data) {
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
            matches: {
                id: data.matches.id,
                utcDate: data.matches.utcDate,
                group: data.matches.group,
                status: data.matches.status,
                homeTeam: {
                    name: data.matches.homeTeam.name
                },
                awayTeam: {
                    name: data.matches.awayTeam.name
                }
            }
        }
    }
    databasePromise().then(db => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(item);
        return tx.complete;
    }).then(function () {
        document.getElementById("iconFav").innerHTML = "favorite";
        M.toast({
            html: 'Added to Favorite!'
        });
    }).catch(function () {
        M.toast({
            html: 'Something went wrong'
        });
    });
}
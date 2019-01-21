function databasePromise(idb) {
    return idb.openDb("onestopfootball", 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains("favorite_team")) {
            let indexTeam = upgradeDb.createObjectStore("favorite_team", {
                keyPath: "id"
            });
            indexTeam.createIndex("teamName", "name", {
                unique: false
            });
        }
        if (!upgradeDb.objectStoreNames.contains("favorite_match")) {
            let indexMatch = upgradeDb.createObjectStore("favorite_match", {
                keyPath: "id"
            });
            indexMatch.createIndex("homeTeam", "match.homeTeam.name", {
                unique: false
            });
            indexMatch.createIndex("awayTeam", "match.awayTeam.name", {
                unique: false
            });
        }
    });
}

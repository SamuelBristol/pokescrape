'use strict';
const cheerio = require('cheerio');

const getRBYDetails = (pkmnDetails) => {
    return {
        id: pkmnDetails[2][1][2],
        name: pkmnDetails[2][1][0],
        types: pkmnDetails[2][1][3],
        capturerate: pkmnDetails[2][3][3],
        moves_levelup: pkmnDetails[9].slice(2).map((row, i, arr) => {
            if (i % 2 == 0) {
                return {
                    level: row[0], name: row[1], type: row[2],
                    power: row[3], accuracy: row[4], pp: row[5],
                    effectchance: row[6], description: arr[i + 1][0]
                }
            }
        }).filter(x => x !== undefined),
        moves_learnable: pkmnDetails[10].slice(2)
            .map((row, i, arr) => {
                if (i % 2 == 0) {
                    return {
                        id: row[0], name: row[1], type: row[2],
                        power: row[3], accuracy: row[4], pp: row[5],
                        effectchance: row[6], description: arr[i + 1][0]
                    }
                }
            }).filter(x => x !== undefined),

    };
}

const getRBYLocations = (details) => {
    const games = details.slice(2);
    var result = [];

    for (var i = 0; i < games.length; i++) {
        const gameArray = games[i];
        var gameName = gameArray[0][0];

        const locations = gameArray.slice(2);
        for (var j = 0; j < locations.length; j++) {
            const row = locations[j];
            result.push({
                game: gameName,
                location: row[0], method: row[1], rarity: row[2],
                minLevel: row[3], maxLevel: row[4]
            });
        }
    }

    return result;
}

const getRBYUrls = (htmlDocument) => {
    const $ = cheerio.load(htmlDocument);
    return $('select[name="SelectURL"]')
        .find("option")
        .toArray()
        .filter((el, i) => { return $(el).val().startsWith("/") })
        .map((el, i) => {
            return {
                id: $(el).text().match(/([0-9])+/g)[0],
                dexUrl: "https://serebii.net" + $(el).attr("value"),
                locationUrl: "http://serebii.net/pokedex/location/"
                    + $(el).text().match(/([0-9])+/g)[0]
                    + ".shtml"
            }
        });
}

exports.getRBYDetails = getRBYDetails;
exports.getRBYLocations = getRBYLocations;
exports.getRBYUrls = getRBYUrls;
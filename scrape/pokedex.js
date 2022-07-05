'use strict';
const cheerio = require('cheerio');

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

exports.getRBYUrls = getRBYUrls;
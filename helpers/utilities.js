'use strict';

const cheerio = require('cheerio');



const flattenTables = (htmlDocument) => {
    const $ = cheerio.load(htmlDocument);
    const tables = $("table.dextable tbody").toArray().map(table => {
        return $(table).children("tr").toArray().map(row => {
            return $(row).children("td").toArray().map(td => {
                if ($(td).text().length > 0) {
                    return $(td).text().trim();
                }

                if ($(td).children("a").length > 0) {
                    return $(td).children("a").toArray().map(a =>
                        $(a).attr("href").match(/([a-z])+/g)[1]
                    ).join(",");
                }

                if ($(td).children("img").length > 0) {
                    return $(td).children("img").toArray().map(img =>
                        $(img).attr("src").match(/([a-z])+/g)[3]
                    ).join(",");
                }
            })
        })
    });
    return tables;
}

exports.flattenTables = flattenTables;
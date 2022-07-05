'use strict';
const files = require('./helpers/files');
const http = require('./helpers/http');
const cheerio = require('cheerio');

// download the index pages
setupFolders()
    .then(async (path) => {
        const promises = (await files.getDirectories(path))
            .map(folder => `${path}/${folder}/index.html`)
            .map(async (filepath, fileindex) => {
                const $ = cheerio.load((await files.readFile(filepath)));
                return $('select[name="SelectURL"]')
                    .filter((i, el) => i <= fileindex)
                    .children("option")
                    .filter((i, el) => i > 0)
                    .toArray()
                    .map((el, i) => 'https://serebii.net' + el.attribs.value);
            });
        return Promise.all(promises);
    })
    .catch(e => console.error(e));

async function setupFolders() {
    const indexUrls = [
        'https://serebii.net/pokedex', 'https://serebii.net/pokedex-gs',
        'https://serebii.net/pokedex-rs', 'https://serebii.net/pokedex-dp',
        'https://serebii.net/pokedex-bw', 'https://serebii.net/pokedex-xy',
        'https://serebii.net/pokedex-sm', 'https://serebii.net/pokedex-swsh'
    ];
    const rootPath = `./data`;
    await files.createDirectoryIfNotFound(rootPath);
    
    for (var i = 0; i < indexUrls.length; i++) {
        const currentPath = await files.createDirectoryIfNotFound(`${rootPath}/gen${i + 1}`);

        await Promise.all([
            files.createDirectoryIfNotFound(`${currentPath}/dex`),
            files.createDirectoryIfNotFound(`${currentPath}/locations`)]);

        if (!await files.pathExists(`${currentPath}/index.html`)) {
            const response = await http.get(indexUrls[i]);
            await files.createFile(`${currentPath}/index.html`, response.data);
        }
    }

    return rootPath;
}
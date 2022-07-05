"use strict";

const filesystem = require("fs");
const fs = filesystem.promises;

module.exports = {
    createFile: async function(path = "", data = "") {
        return fs.writeFile(path, data)
            .then(() => path)
    },
    createDirectory: async function(path = "") {
        return fs.mkdir(path)
            .then(() => path)
    },
    createDirectoryIfNotFound: async function(path = "") {
        if (!await this.pathExists(path))
            await this.createDirectory(path)

        return path;
    },
    getDirectories: async function (path = "") {
        return (await fs.readdir(path, { withFileTypes: true }))
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    },
    pathExists: async function(path = "") {
        return fs.access(path, filesystem.constants.F_OK)
            .then(() => true)
            .catch(e => false)
    },
    readFile: async function (path = "", encoding = "utf8") {
        return (await fs.readFile(path, { encoding: encoding, flag: 'r' }));
    }
};
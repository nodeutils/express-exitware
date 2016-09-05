"use strict";
module.exports = function (path) {
    const fs = require("fs");
    let responses = {
        badRequest: function (responseText) {
            this.res.status(400).send(responseText);
        },
        forbidden: function (responseText) {
            this.res.status(403).send(responseText);
        },
        notFound: function (responseText) {
            this.res.status(404).send(responseText);
        },
        ok: function (data, json) {
            this.res.status(200);
            if (json === true) {
                return this.res.json(data);
            }
            return this.res.send(data);
        },
        serverError: function (message) {
            this.res.status(500).send(message);
        }
    };
    if (path) {
        const filesAndFolders = fs.readdirSync(path, "utf8");
        filesAndFolders.forEach(fileOrFolder => {
            const shortName = fileOrFolder.replace(/\.[^/.]+$/, "");
            const stats = fs.statSync(path + "/" + fileOrFolder);
            if (stats.isFile() && fileOrFolder.endsWith(".js")) {
                responses[shortName] = require(path + "/" + fileOrFolder);
            } else if (stats.isDirectory()) {
                try {
                    const indexResult = fs.statSync(path + "/" + fileOrFolder + "/index.js");
                    responses[shortName] = require(path + "/" + fileOrFolder);
                } catch (e) {
                    if (e.code !== 'ENOENT') {
                        throw e;
                    }
                }
            }
        });
    }
    return function (req, res, next) {
        const binding = {req, res, next};
        for (var property in responses) {
            if (responses.hasOwnProperty(property)) {
                res[property] = responses[property].bind(binding);
            }
        }
        next();
    };
};
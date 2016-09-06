"use strict";

module.exports = function (path) {
    var fs = require("fs");
    var responses = {
        badRequest: function badRequest(responseText) {
            this.res.status(400).send(responseText);
        },
        forbidden: function forbidden(responseText) {
            this.res.status(403).send(responseText);
        },
        notFound: function notFound(responseText) {
            this.res.status(404).send(responseText);
        },
        ok: function ok(data, json) {
            this.res.status(200);
            if (json === true) {
                return this.res.json(data);
            }
            return this.res.send(data);
        },
        serverError: function serverError(message) {
            this.res.status(500).send(message);
        }
    };
    if (path) {
        var filesAndFolders = fs.readdirSync(path, "utf8");
        filesAndFolders.forEach(function (fileOrFolder) {
            var shortName = fileOrFolder.replace(/\.[^/.]+$/, "");
            var stats = fs.statSync(path + "/" + fileOrFolder);
            if (stats.isFile() && fileOrFolder.endsWith(".js")) {
                responses[shortName] = require(path + "/" + fileOrFolder);
            } else if (stats.isDirectory()) {
                try {
                    var indexResult = fs.statSync(path + "/" + fileOrFolder + "/index.js");
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
        var binding = { req: req, res: res, next: next };
        for (var property in responses) {
            if (responses.hasOwnProperty(property)) {
                res[property] = responses[property].bind(binding);
            }
        }
        next();
    };
};
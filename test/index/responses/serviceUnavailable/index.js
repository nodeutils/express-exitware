"use strict";
module.exports = function (message) {
    this.res.status(503).send(message);
};
"use strict";
module.exports = function () {
    var itemName = this.req.params.identity;
    this.res.status(429).send("Too Many Requests to " + itemName);
};
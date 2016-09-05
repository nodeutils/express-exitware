"use strict";

var express = require("express");

var expressResponse = require("express-exitware");
var app = express();

app.use(expressResponse(__dirname + "/responses"));

app.get('/', function (req, res) {
    res.ok("HELLO WORLD");
});

app.get('/send400', function (req, res) {
    res.badRequest("Bad Request");
});

app.get('/sendForbidden', function (req, res) {
    res.forbidden("You are forbidden");
});

app.get('/send404', function (req, res) {
    res.notFound("Not Found");
});

app.get('/send500', function (req, res) {
    res.serverError("Something Went Wrong");
});

app.get('/send429/:identity', function (req, res) {
    res.tooManyRequests();
});

app.get('/send503', function (req, res) {
    res.serviceUnavailable("Sorry, service unavailable");
});

app.listen(3000, function () {
    console.log('Example app running on port 3000');
});
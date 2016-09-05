"use strict";
describe("index.js", function () {
    const chai = require("chai");
    const expect = chai.expect;
    var expressResponse = require("../../lib");
    var app = require("express")();

    app.use(expressResponse(__dirname + "/responses"));

    app.get('/', function (req, res) {
        res.ok("HELLO WORLD");
    });

    app.get('/json', function (req, res) {
        res.ok({"HELLO": "WORLD"}, true);
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

    it("200", function (done) {
        chai.request(app)
            .get('/')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.text).to.equal("HELLO WORLD");
                done();
            })
            .catch(done);
    });

    it("200 JSON", function (done) {
        chai.request(app)
            .get('/json')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equal({"HELLO":"WORLD"});
                done();
            })
            .catch(done);
    });

    it("400", function (done) {
        chai.request(app)
            .get('/send400')
            .then(function (res) {
                done(new Error("Should not return OK"));
            })
            .catch(function(err){
                expect(err.status).to.equal(400);
                expect(err.response.text).to.equal("Bad Request");
                done();
            });
    });

    it("403", function (done) {
        chai.request(app)
            .get('/sendForbidden')
            .then(function (res) {
                done(new Error("Should not return OK"));
            })
            .catch(function(err){
                expect(err.status).to.equal(403);
                expect(err.response.text).to.equal("You are forbidden");
                done();
            });
    });

    it("404", function (done) {
        chai.request(app)
            .get('/send404')
            .then(function (res) {
                done(new Error("Should not return OK"));
            })
            .catch(function(err){
                expect(err.status).to.equal(404);
                expect(err.message).to.equal("Not Found");
                done();
            });
    });

    it("500", function (done) {
        chai.request(app)
            .get('/send500')
            .then(function (res) {
                done(new Error("Should not return OK"));
            })
            .catch(function(err){
                expect(err.status).to.equal(500);
                expect(err.response.text).to.equal("Something Went Wrong");
                done();
            });
    });

    it("429", function (done) {
        chai.request(app)
            .get('/send429/someUnitTest')
            .then(function (res) {
                done(new Error("Should not return OK"));
            })
            .catch(function(err){
                expect(err.status).to.equal(429);
                expect(err.response.text).to.equal("Too Many Requests to someUnitTest");
                done();
            });
    });

});
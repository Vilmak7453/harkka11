"use strict";
var express = require('express');
var router = express.Router();

var thingController = require("../controllers/thingController");
var userController = require("../controllers/userController");
var auth = require('./auth');

router.get("/", function(req, res) {
	
	res.redirect("/list/bestlist");
});

router.get("/bestlist", auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	authUser.then((user) => { 
		res.render("bestlist", {title: "Kivoja asioita", user: user});
	});
});

router.post("/bestlist", auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	authUser.then((user) => { 
		res.render("bestlist", {title: "Kivoja asioita", user: user});
	});
});

router.post("/addThing", auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	authUser.then((user) => {
		req.body.user = user;
		thingController.save_thing(req, res, next);
	});
});

router.get("/retrieveThings", auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	authUser.then((user) => {
		req.body.user = user;
		thingController.retrieve_things(req, res, next);
	});
});

router.post("/removeThing", auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	authUser.then((user) => {
		req.body.user = user;
		thingController.remove_thing(req, res, next);
	});
})

module.exports = router;


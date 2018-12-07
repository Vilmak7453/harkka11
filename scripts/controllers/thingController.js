"use strict";
var Thing = require("../models/thing");

exports.save_thing = function(req, res, next) {
	
	var currentUser = req.body.user;
	if(currentUser !== undefined && currentUser !== null) {
		var newThing = req.body.thing;
		if(checkThing(newThing)) {
			console.log("Saving thing " + newThing);

			var thing = new Thing({
				user: currentUser,
				name: newThing
			});
			thing.save(
				function (err) {
		            if (err) { 
		            	var error = {msg: "Saving thing failed"};
		            	console.log(error.msg);
		            	return res.send(error); 
		            }
					console.log("Thing saved " + newThing);
					res.send({stat:"OK"});
		    });
		}
		else {
    	    var error = {msg: "Juttu saa olla 20 merkkiä pitkä ja sisältää vain kirjaimia, numeroita, pisteitä ja pilkkuja!"};
	    	console.log(error.msg);
	    	res.send(error);
		}
	}
	else {
        var error = {msg: "User not found"};
    	console.log(error.msg);
    	res.send(error);
	}
};

exports.retrieve_things = function(req, res, next) {

	var currentUser = req.body.user;
	if(currentUser !== undefined && currentUser !== null) {
		Thing.find({'user': currentUser}).exec(
			function(err, thing_list) {
				if (err) { 
					var error = {msg: "Esineitä ei löytynyt"}; 
					return res.send(error); 
				}

				res.send(thing_list);
		});
	}
	else {
        var err = {msg: "User not found"};
    	res.send(err);
	}
}

exports.remove_thing = function(req, res, next) {

	var currentUser = req.body.user;
	if(currentUser !== undefined && currentUser !== null) {
		var rmThing = req.body.thing;
		Thing.find({'name' : rmThing, 'user': currentUser}).deleteOne().exec(function(err) {
			if(err) {
				var error = {msg: "Removing " + rmThing + " failed"};
				return res.send(error);
			}
			else {
				console.log("Removing " + rmThing + " successful");
				res.send({stat:"OK"});
			}
		});
	}
	else {
        var err = {msg: "User not found"};
    	res.send(err);
	}	
}

function checkThing(thing) {
	var regex = RegExp("^[A-za-z1-9.,\\s]{1,20}$");
	return regex.test(thing);
}
const cherrio = require("cherrio");
const request = require("request");
const db = require("../models")

module.exports = function(app) {
	app.get("/", function (req,res) {
		db.Article.find().sort({created: -1})
		.then(function(results) {
			res.render("index", {results : results});
		})
	})

	app.get("/savedArticles", function(req,res) {
		db.Article.find( {saved: true} ).sort( {created:1} )
		.then(function(results){
			res.render("savedArticles", {results: results});
			
		})
	})
}
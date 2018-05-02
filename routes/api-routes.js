const cheerio = require("cheerio");
const request = require("request");
const db = require("../models");

module.exports = function(app) {
	app.get("/api/scrape", function(req, res) {
		request("http://www.nintendolife.com/", function(error, result, html) {
			const $ = cheerio.load(html);
			$("li.item-article").each(function(i, element) {
				const results = {};
				const title = $(element).find("span.title").text();
				const link = $(element).find("a.title").attr("href");
				const description = $(element).find("p.text").text();

				results.title = title;
				results.link = link;
				if (!!description) {
					results.description = description;
				} else {
					results.description = "No preview text available"
				}

				db.Article.find({title: results.title})
				.then(function(inDb) {
					if (!inDb || inDb.length === 0) {
						db.Article.create(results)					
					}
				});

			})
		})
		res.render("index");
	});

	app.get("/api/getNotes/:id", function(req, res) {
		db.Article.find({ _id: req.params.id })
		.populate("notes")
		.then(function(results) {
			res.json(results[0].notes);
		})
	})

	app.post("/api/newNote", function(req, res) {
		db.Note.create({
			title: req.body.title,
			message: req.body.message
		})
		.then(function(dbNote) {
			return db.Article.findOneAndUpdate(
				{ _id: req.body.id }, 
				{ $push: { notes: dbNote._id} })
		})
	})

	app.delete("/api/removeNote/:id", function(req, res) {
		db.Note.remove({_id: req.params.id})
		.then(function(deteled) {
			console.log("Note deleted");
		});
	})

	app.put("/api/saveArticle", function(req, res) {
		const id = req.body.id;
		db.Article.updateOne(
			{_id: id}, 
			{$set: {saved: true}}, 
			{new: true}, 
			function(err, doc) {
				res.json(doc);
			}
		)
	})

	app.put("/api/removeArticle", function(req, res) {
		const id = req.body.id;
		db.Article.updateOne(
			{_id: id}, 
			{$set: {saved: false}}, 
			{new: true}, 
			function(err, doc) {
				res.json(doc);
			}
		)
	})

}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	saved: {
		type: Boolean,
		default: false
	},
	notes: [{
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
	]
});

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
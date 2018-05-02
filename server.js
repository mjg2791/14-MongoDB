const express = require("express");
const bodyParser = require("bodyParser");
const mongoose = require("mongoose");
const exphb = require ("express-handlebars");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine("handlebars", exphb({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(express.static(public));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadliner";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

app.listen(PORT, function() {
	console.log("listening on port" + PORT)
})
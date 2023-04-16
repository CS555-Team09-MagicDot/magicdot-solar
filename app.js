const express = require("express");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const app = express();

const configRoutes = require("./routes");
const exphbars = require("express-handlebars");

const static = express.static(__dirname + "/public");
app.use("/public", static);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
	session({
		name: "Magicdot - Solar",
		secret: "Team09",
		resave: false,
		saveUninitialized: true,
	})
);

app.use(fileUpload());

app.use("*", (req, res, next) => {
	console.log(`Method: ${req.method} | URL: ${req.originalUrl}`);
	next();
});

configRoutes(app);

app.listen(3000, () => {
	console.log("Your routes will be running on http://localhost:3000");
});

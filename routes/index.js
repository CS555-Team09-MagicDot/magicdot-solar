const homepageRoutes = require("./homepage");
const adminRoutes = require("./admin");
const inquiryRoutes = require("./salesInquiry");
const path = require("path");

const constructorMethod = (app) => {
	app.use("/", homepageRoutes);
	app.use("/", adminRoutes);
	app.use("/inquiry", inquiryRoutes);
	app.use("/about", (req, res) => {
		res.sendFile(path.resolve("static/about.html"));
	});

	app.use("*", (req, res) => {
		res.status(404).json({ error: "not found" });
	});
};

module.exports = constructorMethod;

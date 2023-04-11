const homepageRoutes = require("./homepage");
const loginRoutes = require("./login");
const logoutRoutes = require("./logout");
const salesRoutes = require("./sales");
const inquiryRoutes = require("./salesInquiry");
const operationsDashboard = require("./operations");
const customerRoutes = require("./customer");
const onsiteRoutes = require("./onsite");
const path = require("path");

const constructorMethod = (app) => {
	app.use("/", homepageRoutes);
	app.use("/login", loginRoutes);
	app.use("/logout", logoutRoutes);
	app.use("/sales", salesRoutes);
	app.use("/inquiry", inquiryRoutes);
	app.use("/operations", operationsDashboard);
	app.use("/customer", customerRoutes);
	app.use("/onsite", onsiteRoutes);
	app.use("/about", (req, res) => {
		res.sendFile(path.resolve("static/about.html"));
	});

	app.use("*", (req, res) => {
		res.status(404).sendFile(path.resolve("static/notfound.html"));
	});
};

module.exports = constructorMethod;

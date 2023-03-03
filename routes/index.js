const homepageRoutes = require("./homepage");
const adminRoutes = require("./admin");
const inquiryRoutes = require("./salesInquiry");

const constructorMethod = (app) => {
	app.use("/", homepageRoutes);
	app.use("/", adminRoutes);
	app.use("/inquiry", inquiryRoutes);

	app.use("*", (req, res) => {
		res.status(404).json({ error: "not found" });
	});
};

module.exports = constructorMethod;

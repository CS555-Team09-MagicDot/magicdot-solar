const express = require("express");
const router = express.Router();

router.route("/").get(async (req, res) => {
	if (!req.session.user || req.session.user.role !== "operational manager") {
		return res.redirect("/");
	}
	try {
		return res.status(200).render("operationsDashboard", {
			title: "Operations Dashboard",
		});
	} catch (error) {
		return res.status(400).render("error", { error: error });
	}
});

module.exports = router;

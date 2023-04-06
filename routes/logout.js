const express = require("express");
const router = express.Router();

router.route("/").get(async (req, res) => {
	try {
		req.session.destroy();
		return res.status(200).redirect("/");
	} catch (e) {
		return res.status(e.status).render("homepage", { error: e.message });
	}
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.route("/").get(async (req, res) => {
	try {
		return res.status(200).render("homepage", { title: "Magicdot - Home" });
	} catch (e) {
		return res.status(e.status).render("homepage", { error: e.message });
	}
});

router.route("/home").get(async(req, res)=>{

});

router.route("/about").get(async(req, res)=>{

});

router.route("/services").get(async(req, res)=>{

});

router.route("/projects").get(async(req, res)=>{

});

module.exports = router;

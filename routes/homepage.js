const express = require("express");
const validators = require("../validators");
const users = require("../data/users");
const router = express.Router();
const collections = require("../config/mongoCollections");
const usersdata = collections.users;

router.route("/").get(async (req, res) => {
	try {
		const itUser = await users.getUserByEmail("it_admin@magicdot.com");
		if (!itUser) {
			await users.createUser("IT ADMIN", "IT ADMIN", "it admin", "it_admin@magicdot.com", "1231231234", "ItAdmin@12345");
		}
		let isLoggedIn = false;
		if (req.session.user) isLoggedIn = true;
		return res.status(200).render("homepage", { title: "Magicdot - Home", isLoggedIn: isLoggedIn });
	} catch (e) {
		return res.status(e.status).render("homepage", { error: e.message });
	}
});

// router.route("/home").get(async(req, res)=>{

// });

router.route("/services").get(async (req, res) => {
	return res.status(200).render("homepage", { title: "Magicdot - Services" });
});

router.route("/projects").get(async (req, res) => {
	return res.status(200).render("homepage", { title: "Magicdot - Projects" });
});

module.exports = router;

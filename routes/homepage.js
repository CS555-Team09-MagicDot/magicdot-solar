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
		return res.status(200).render("homepage", { title: "Magicdot - Home" });
	} catch (e) {
		return res.status(e.status).render("homepage", { error: e.message });
	}
});

// router.route("/home").get(async(req, res)=>{

// });

router.route("/services").get(async (req, res) => {});

router.route("/projects").get(async (req, res) => {});

router
	.route("/login")
	.get(async (req, res) => {
		try {
			if (req.session.user) {
				if (req.session.role === "sales representative") return res.status(200).redirect("/sales");
				else if (req.session.role === "customer") return res.status(200).redirect("/customer");
				else if (req.session.role === "it admin") return res.status(200).redirect("/it_admin");
			}
			return res.status(200).render("login", { title: "Magicdot - Admin" });
		} catch (e) {
			return res.status(e.status).render("homepage", { error: e.message });
		}
	})
	.post(async (req, res) => {
		try {
			let data = req.body;
			//data.email = validators.validateEmail(data.email);
			//let userData = await users.checkUser(data.email, data.password);
			//Temporary Login Setup
			// const userCollection = await usersdata();
			const user = await users.checkUser(data.email, data.password);
			if (!user) throw { status: 400, message: "Incorrect email or password" };
			const userData = {
				_id: user._id.toString(),
				name: user.name,
				role: user.role,
				email: user.email,
				phoneNumber: user.phoneNumber,
				isSigned: user.isSigned,
			};
			req.session.user = userData;
			if (userData.role === "sales representative") return res.status(200).redirect("/sales");
			else if (userData.role === "customer") return res.status(200).redirect("/customer");
			else return res.status(200).render("homepage");
		} catch (e) {
			return res.status(e.status).render("homepage", { error: e.message });
		}
	});

router.route("/logout").get(async (req, res) => {
	try {
		req.session.destroy();
		return res.status(200).redirect("/");
	} catch (e) {
		return res.status(e.status).render("homepage", { error: e.message });
	}
});

module.exports = router;

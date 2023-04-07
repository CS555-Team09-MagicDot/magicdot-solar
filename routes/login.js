const express = require("express");
const users = require("../data/users");
const router = express.Router();

router
	.route("/")
	.get(async (req, res) => {
		try {
			if (req.session.user) {
				if (req.session.user.role === "sales representative") return res.status(200).redirect("/sales");
				else if (req.session.user.role === "customer") return res.status(200).redirect("/customer");
				else if (req.session.user.role === "it admin") return res.status(200).redirect("/it_admin");
			}
			return res.status(200).render("login", { title: "Magicdot - Admin" });
		} catch (e) {
			return res.status(e.status).render("homepage", { error: e.message });
		}
	})
	.post(async (req, res) => {
		try {
			let data = req.body;
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
			else if (userData.role === "operational manager") return res.status(200).redirect("/operations");
		} catch (e) {
			return res.status(e.status).render("login", { error: e.message });
		}
	});

module.exports = router;

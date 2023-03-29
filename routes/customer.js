const express = require("express");
const validators = require("../validators");
const users = require("../data/users");
const customerData = require("../data/customer");
const router = express.Router();
const PDFDocument = require("pdfkit");

router.route("/").get(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "customer") {
			return res.status(200).redirect("/");
		}

		//Uncomment following line when agreement/document functionality is ready
		//if(req.session.user.isSigned === false) return res.status(200).render("customerAgreement", {title: "Customer Agreement", user: req.session.user});

		const ongoingProjects = customerData.getCustomerOnGoingProjects(req.session.user._id);
		const finishedProjects = customerData.getCustomerFinishedProjects(req.session.user._id);

		return res.status(200).render("customerDashboard", {
			title: "Customer Dashboard",
			user: req.session.user,
			ongoingProjects: ongoingProjects,
			finishedProjects: finishedProjects,
		});
	} catch (e) {
		//return res.status(e.status).render("homepage", { error: e.message });
		return console.log("Error");
	}
});

router.route("/documents").get(async (req, res) => {
	try {
		return res.status(200).render("customerAgreement", {
			title: "Customer Agreement",
			user: req.session.user,
		});
	} catch (e) {
		//return res.status(e.status).render("homepage", { error: e.message });
		return console.log("Error");
	}
});

router.route("/customerAgreement").post(async (req, res) => {
	try {
		//const user = req.session.user
		//email = user.email

		const customer = await users.checkUserAgreement(req.body.email);
		// Find the customer by email and update their record

		// If the customer is not found, return a 404 error
		if (!customer) {
			return res.status(404).send("Customer not found");
		}
		req.session.user.isSigned = true;
		// If the customer is updated successfully, return a success message
		return res.status(200).redirect("/customer");
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal Server Error");
	}
});

router.get("/customerAgreement/download", async (req, res) => {
	try {
		const pdfDoc = new PDFDocument();
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", "attachment; filename=agreement.pdf");

		pdfDoc.pipe(res);
		pdfDoc.fontSize(20).text(`Agreement for ${req.session.user.name}`, { underline: true });
		pdfDoc.fontSize(12).text("This agreement confirms that the customer has agreed to the terms and conditions set forth by the company.");
		pdfDoc.end();
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

router.route("/chat").get(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "customer") {
			return res.status(200).redirect("/");
		}
		//console.log(req.session.user);
		return res.status(200).render("chat", { title: "Chat", user: req.session.user });
	} catch (error) {
		return res.status(400).render("error", { error: error });
	}
});

module.exports = router;

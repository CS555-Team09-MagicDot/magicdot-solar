const validators = require("../validators");
const salesInquiryData = require("../data/salesInquiry");
const express = require("express");
const router = express.Router();

router.route("/").post(async (req, res) => {
	try {
		req.body.firstName = validators.validateName(req.body.firstName, "first name");
		req.body.lastName = validators.validateName(req.body.lastName, "last name");
		req.body.email = validators.validateEmail(req.body.email);
		req.body.phoneNumber = validators.validatePhone(req.body.phoneNumber);
		req.body.subject = validators.validateSubject(req.body.subject);
		req.body.message = validators.validateMessage(req.body.message);
	} catch (e) {
		return res.status(e.status).render("homepage", { error: e.message });
	}

	try {
		let createInquiry = await salesInquiryData.newInquiry(req.body.firstName, req.body.lastName, req.body.email, req.body.phoneNumber, req.body.subject, req.body.message, req.files);
		if (createInquiry) {
			return res.status(200).render("homepage", { inquirySuccess: true });
		}
	} catch (e) {
		console.log(e);
		return res.status(500).render("homepage", { error: e.message });
	}
});

router.route("/getInq", async (req, res) => {
	try {
		req.body.firstName = validators.validateName(req.body.firstName, "first name");
		req.body.lastName = validators.validateName(req.body.lastName, "last name");
		req.body.email = validators.validateEmail(req.body.email);
		req.body.phoneNumber = validators.validatePhone(req.body.phoneNumber);
	} catch (e) {
		return res.status(e.status).json({ error: e });
	}

	try {
		let createInquiry = await salesInquiryData.getInquiry(req.body);
		if (createInquiry) {
			return res.status(200).render("homepage", { data: getInquiry });
		}
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

router.route("/getData").get(async (req, res) => {
	try {
	  req.body.firstName = validators.validateName(
		req.body.firstName,
		"first name"
	  );
	  req.body.lastName = validators.validateName(req.body.lastName, "last name");
	  req.body.email = validators.validateEmail(req.body.email);
	  req.body.phoneNumber = validators.validatePhone(req.body.phoneNumber);
	} catch (e) {
	  return res.status(e.status).json({ error: e });
	}
  
	try {
	  const inquiries = await salesInquiryData.getInquiry(req.body);
	  return res.status(200).render("saleshomepage", {
		inquiries: inquiries,
	  });
	} catch (e) {
	  return res.status(500).json({ error: e.message });
	}
  });

module.exports = router;
const express = require("express");
const router = express.Router();
const salesInquiryData = require("../data/salesInquiry");
const usersData = require("../data/users");
const sendMailData = require("../data/sendMail");
const projectRequestData = require("../data/projectRequest");

router.route("/").get(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "sales representative") {
			return res.status(200).redirect("/");
		}
		var newInquiryList = await salesInquiryData.getNewSalesInquiryList();
		var ongoingInquiryList = await salesInquiryData.getOngoingInquiryList(req.session.user._id);
		let totalInquiriesAmount = await salesInquiryData.totalInquiriesAmount();

		return res.status(200).render("salesDashboard", {
			newInquiryList: newInquiryList,
			newInquiryListCount: newInquiryList.length,
			ongoingInquiryList: ongoingInquiryList,
			ongoingInquiryListCount: ongoingInquiryList.length,
			totalInquiriesCount: totalInquiriesAmount,
			title: "Sales Dashboard",
		});
	} catch (error) {
		return res.status(400).render("error", { error: error });
	}
});

router.route("/inquirydetails/:inquiryId").get(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "sales representative") {
			return res.status(200).redirect("/");
		}
		const inquiryDetails = await salesInquiryData.getInquiryById(req.params.inquiryId);
		const userDetails = await usersData.getUserById(inquiryDetails.customerId);
		console.log(userDetails);
		return res.status(200).render("inquiryDetails", { title: "Magicdot - Inquiry Details", inquiryDetails: inquiryDetails, userDetails: userDetails, inquiryId: req.params.inquiryId });
	} catch (error) {
		return res.status(400).render("error", { error: error });
	}
});

router.route("/generateaccount/:id").get(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "sales representative") {
			return res.status(200).redirect("/");
		}
		var status = await sendMailData.generateCredentialsAndSendEmail(req.params.id, req.session.user._id);
		console.log(status);

		return res.redirect("/sales");
	} catch (error) {
		return res.status(400).render("error", { error: error });
	}
});

router.route("/requirementsubmission/:inquiryId")
	.get(async (req, res) => {
		try {
			if (!req.session.user || req.session.user.role !== "sales representative") return res.status(200).redirect("/");

			return res.status(200).render("salesRequirementSubmission", {
				title: "Submit Requirements",
				inquiryId: req.params.inquiryId
			});
		} catch (e) {
			return res.status(400).render("error", { error: e });
		}
	})
	.post(async (req, res) => {
		if (!req.session.user || req.session.user.role !== "sales representative") return res.status(200).redirect("/");

		var projectReq = await projectRequestData.createProjectRequest(req.params.inquiryId, req.body.totalCoverageArea, req.body.previousYearAnnualUsage , req.body.previousYearAnnualEnergyCost , req.body.address);
		var closeInquiry = await salesInquiryData.closeSalesInquiry(req.params.inquiryId);

		return res.redirect("/sales");
	});


module.exports = router;
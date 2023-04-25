const express = require("express");
const router = express.Router();
const salesInquiryData = require("../data/salesInquiry");
const usersData = require("../data/users");
const sendMailData = require("../data/sendMail");
const projectRequestData = require("../data/projectRequest");
const validators = require("../validators");
const projectData = require("../data/project");

router.route("/").get(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "sales representative") {
			return res.status(200).redirect("/");
		}
		var newInquiryList = await salesInquiryData.getNewSalesInquiryList();
		var ongoingInquiryList = await salesInquiryData.getOngoingInquiryList(req.session.user._id);
		let totalInquiriesAmount = await salesInquiryData.totalInquiriesAmount();

		if (newInquiryList.length > 0) {
			for (let inquiry of newInquiryList) {
				if (inquiry.subject.split(" ").length > 5) {
					inquiry.subject = inquiry.subject.split(" ").slice(0, 5).join(" ") + "...";
				}
				if (inquiry.message.split(" ").length > 10) {
					inquiry.message = inquiry.message.split(" ").slice(0, 10).join(" ") + "...";
				}
			}
		}

		if (ongoingInquiryList.length > 0) {
			for (let inquiry of ongoingInquiryList) {
				if (inquiry.subject.split(" ").length > 5) {
					inquiry.subject = inquiry.subject.split(" ").slice(0, 5).join(" ") + "...";
				}
				if (inquiry.message.split(" ").length > 10) {
					inquiry.message = inquiry.message.split(" ").slice(0, 10).join(" ") + "...";
				}
			}
		}

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

router
	.route("/inquirydetails/:inquiryId")
	.get(async (req, res) => {
		try {
			if (!req.session.user || req.session.user.role !== "sales representative") {
				return res.status(200).redirect("/");
			}
			const inquiryDetails = await salesInquiryData.getInquiryById(req.params.inquiryId);
			const userDetails = await usersData.getUserById(inquiryDetails.customerId);
			const messages = await salesInquiryData.getInquiryMessages(req.params.inquiryId);
			for (let message of messages) {
				if (message.userId === req.session.user._id) {
					message.me = true;
				} else {
					message.me = false;
				}
			}
			console.log(userDetails);

			var projectStatus = 0;

			// If project is created by operational manager
			if (inquiryDetails.isProjectCreated){
				const projectDetails = await projectData.getProjectById(inquiryDetails.projectId);
				console.log(projectDetails.status);
				
				if(projectDetails.status == 'approved'){projectStatus=1}
				else if(projectDetails.status == 'site inspection'){projectStatus=2}
				else if(projectDetails.status == 'inventory check'){projectStatus=3}
				else if(projectDetails.status == 'under construction'){projectStatus=4}
				else if(projectDetails.status == 'final inspection'){projectStatus=5}
				else if(projectDetails.status == 'finished'){projectStatus=6}
				else { throw "Project Status Invalid"}
			}

			console.log(projectStatus);
			
			return res.status(200).render("inquiryDetails", { 
				title: "Magicdot - Inquiry Details", 
				inquiryDetails: inquiryDetails, 
				userDetails: userDetails, 
				inquiryId: req.params.inquiryId, 
				inquiryStatus: inquiryDetails.status, 
				messages: messages,
				projectStatuses: projectStatus
			});
		} catch (error) {
			return res.status(400).render("error", { error: error });
		}
	})
	.post(async (req, res) => {
		try {
			if (!req.session.user || req.session.user.role !== "sales representative") return res.status(200).redirect("/");
			req.params.inquiryId = validators.validateId(req.params.inquiryId, "Inquiry Id");
			req.body.message = validators.validateString(req.body.message, "Message");
			const postMessage = await salesInquiryData.addNewMessage(req.params.inquiryId, req.session.user._id, req.body.message, req.files);
			return res.status(200).redirect("/sales/inquirydetails/" + req.params.inquiryId);
		} catch (e) {
			return res.status(e.status).render("error", { error: e.message });
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

router
	.route("/requirementsubmission/:inquiryId")
	.get(async (req, res) => {
		try {
			if (!req.session.user || req.session.user.role !== "sales representative") return res.status(200).redirect("/");

			return res.status(200).render("salesRequirementSubmission", {
				title: "Submit Requirements",
				inquiryId: req.params.inquiryId,
			});
		} catch (e) {
			return res.status(400).render("error", { error: e });
		}
	})
	.post(async (req, res) => {
		try {
			if (!req.session.user || req.session.user.role !== "sales representative") return res.status(200).redirect("/");

			var projectReq = await projectRequestData.createProjectRequest(req.params.inquiryId, req.body.totalCoverageArea, req.body.previousYearAnnualUsage, req.body.previousYearAnnualEnergyCost, req.body.address);
			var closeInquiry = await salesInquiryData.closeSalesInquiry(req.params.inquiryId);

			return res.redirect("/sales");
		} catch (e) {
			return res.status(e.status).render("error", { error: e.message });
		}
	});

module.exports = router;

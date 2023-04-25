const express = require("express");
const validators = require("../validators");
const users = require("../data/users");
const customerData = require("../data/customer");
const salesInquiryData = require("../data/salesInquiry");
const customerPayment = require("../data/customerPayment");
const router = express.Router();
const PDFDocument = require("pdfkit");
const projectData = require("../data/project");

router.route("/").get(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "customer") {
			return res.status(200).redirect("/");
		}

		//Uncomment following line when agreement/document functionality is ready
		//if(req.session.user.isSigned === false) return res.status(200).render("customerAgreement", {title: "Customer Agreement", user: req.session.user});

		const customer = await users.getUserById(req.session.user._id);
		const inquiryDetails = await salesInquiryData.getInquiryById(customer.customerInquiry);
		const salesRep = await users.getUserById(inquiryDetails.salesRepresentativeAssigned);
		const messages = inquiryDetails.messages;
		for (let message of messages) {
			if (message.userId === req.session.user._id) {
				message.me = true;
			} else {
				message.me = false;
			}
		}
		let currentHour = new Date().getHours();
		let greeting = new String();
		if (currentHour >= 0 && currentHour < 12) greeting = "Good Morning!";
		else if (currentHour >= 12 && currentHour < 17) greeting = "Good Afternoon!";
		else if (currentHour >= 17 && currentHour <= 23) greeting = "Good Evening!";
		else {
			greeting = "Welcome!";
		}

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


		return res.status(200).render("customerDashboard", {
			title: "Customer Dashboard",
			user: req.session.user,
			salesRepName: salesRep.name,
			salesRepPhone: salesRep.phoneNumber,
			inquiryDetails: inquiryDetails,
			messages: messages,
			greeting: greeting,
			projectStatuses: projectStatus
		});
	} catch (e) {
		//return res.status(e.status).render("homepage", { error: e.message });
		return console.log("Error");
	}
});

router.route("/postmessage/:inquiryId").post(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "customer") return res.status(200).redirect("/");
		req.params.inquiryId = validators.validateId(req.params.inquiryId, "Inquiry Id");
		req.body.message = validators.validateString(req.body.message, "Message");
		const postMessage = await salesInquiryData.addNewMessage(req.params.inquiryId, req.session.user._id, req.body.message, req.files);
		return res.status(200).redirect("/customer");
	} catch (e) {
		return res.status(e.status).render("error", { error: e.message });
	}
});

router.route("/documents").get(async (req, res) => {
	try {
		console.log(req.session.user.signedDate)
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
		
		req.body.customerName = validators.validateName(req.body.customerName.replace(/\s+/g, ''), "first name");
		const customer = await users.checkUserAgreement(req.body.email, req.body.datePicker);
		// Find the customer by email and update their record

		// If the customer is not found, return a 404 error
		if (!customer) {
			return res.status(404).send("Customer not found");
		}
		//req.session.user.isSigned = true;
		req.session.user.doc.isSigned = true;
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

router.route("/payments").get(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "customer") {
			return res.status(200).redirect("/");
		}
		const payments = await customerPayment.getPayments(req.session.user._id);

		return res.status(200).render("customerPayments", {
			title: "Customer Payments",
			user: req.session.user,
			payments: payments,
		});
	} catch (e) {
		//return res.status(e.status).render("homepage", { error: e.message });
		return console.log("Error");
	}
});

router.route("/payments/process-payment").post(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "customer") {
			return res.status(200).redirect("/");
		}
		const paymentPlan = req.body["payment-plan"];
		let totalAmount = 0;

		switch (paymentPlan) {
			case "full-payment":
				totalAmount = 500;
				break;
			case "emi-6":
				totalAmount = 550;
				break;
			case "emi-12":
				totalAmount = 600;
				break;
			default:
				// Handle invalid payment plan
				break;
		}

		paymentStatus = await customerPayment.newPayment(req.session.user._id, paymentPlan, new Date(), totalAmount.toFixed(2));

		if (!paymentStatus) {
			console.log("error");
			return res.status(200).render("customerPayments", {
				title: "Customer Payments",
				user: req.session.user,
			});
		}

		res.render("customerPaymentProcess", {
			paymentPlan: paymentPlan,
			totalAmount: `$${totalAmount.toFixed(2)}`,
		});
	} catch (error) {
		return res.status(400).render("error", { error: error });
	}
});

router.route("/payments/:id").get(async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== "customer") {
			return res.status(200).redirect("/");
		}
		paymentId = req.params.id;
		const transactionDetails = await customerPayment.getTransaction(paymentId);

		// Create a PDF document
		const doc = new PDFDocument();

		// Set the response headers to indicate that a PDF file is being downloaded
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", `attachment; filename="${paymentId}.pdf"`);
		doc.pipe(res);
		// Add the transaction details to the PDF document
		doc.fontSize(14).text(`Transaction ID: ${transactionDetails._id}`);
		doc.fontSize(12).text(`Payment Date: ${transactionDetails.date}`);
		doc.fontSize(12).text(`Payment Plan: ${transactionDetails.paymentPlan}`);
		doc.fontSize(12).text(`Amount: ${transactionDetails.ammount}`);

		// Stream the PDF document to the response

		doc.end();

		//console.log(req.session.user);
	} catch (error) {
		return res.status(400).render("error", { error: error });
	}
});

module.exports = router;

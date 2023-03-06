const express = require("express");
const router = express.Router();
const salesInquiryData = require("../data/salesInquiry");
const sendMail = require("../data/sendMail");

router.route("/admin").get(async (req, res) => {
	let haserror = false;
	let isLoggedIn;
	try {
		var inquiryList = await salesInquiryData.getSalesInquiryList();
		//   if (req.session.admin) isLoggedIn = true;
		//   else isLoggedIn = false;

		return res.status(200).render("saleshomepage", { salesInquiryList: inquiryList, title: "Sales Dashboard" });
		//   return res.status(200).render('saleshomepage', {title: "Sales Dashboard", isLoggedIn : isLoggedIn, haserror:haserror});
	} catch (error) {
		haserror = true;
		return res.status(400).render('error', {error:error});
		//return res.status(400).render("saleshomepage", { salesInquiryList: inquiryList, title: "Sales Dashboard"});
	}
	return res.status(500).render("saleshomepage", { salesInquiryList: inquiryList, title: "Sales Dashboard"});
});

router.route("/admin/generateaccount/:id").get(async (req, res) => {
	let haserror = false;
	try {
		// code here
		console.log("Hello Hello... Mike Testing");
		var status = await sendMail.generateCredentialsandsendmail(req.params.id);
		console.log(status);

		res.redirect('/admin');
	} catch (error) {
		haserror=true;
    	return res.status(400).render('error', {error:error});
	}
});

module.exports = router;

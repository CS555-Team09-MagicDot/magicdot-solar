const express = require("express");
const router = express.Router();
const salesInquiryData = require("../data/salesInquiry");

router.route("/admin").get(async (req, res) => {
	let haserror = false;
	let isLoggedIn;
	try {
		var inquiryList = await salesInquiryData.getSalesInquiryList();
		//   if (req.session.admin) isLoggedIn = true;
		//   else isLoggedIn = false;

		return res.status(200).render("saleshomepage", { salesInquiryList: inquiryList, title: "Sales Dashboard" });
		//   return res.status(200).render('adminhomepage', {title: "Sales Dashboard", isLoggedIn : isLoggedIn, haserror:haserror});
	} catch (e) {
		haserror = true;
		return res.status(400).render("adminhomepage", { solution1: sol, title: "Flights Available", isLoggedIn: isLoggedIn, haserror: haserror, error: e });
	}
	return res.status(500).render("adminhomepage", { solution1: sol, title: "Flights Available", isLoggedIn: isLoggedIn, haserror: haserror, error: e });
});

router.route("/admin/generateaccount/:id").get(async (req, res) => {
	let haserror = false;
	try {
		// code here
		console.log("Hello Hello... Mike Testing");

		res.redirect('/admin');
	} catch (error) {
		haserror=true;
    	return res.status(400).render('error', {error:error});
	}
});

module.exports = router;

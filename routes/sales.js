const express = require("express");
const router = express.Router();
const salesInquiryData = require("../data/salesInquiry");
const sendMail = require("../data/sendMail");

router.route("/sales").get(async (req, res) => {
  let haserror = false;
  let isLoggedIn;
  try {
    if (!req.session.user || req.session.user.role !== "sales representative") {
      return res.status(200).redirect("/");
    }
    var activeInquiryList = await salesInquiryData.getActiveSalesInquiryList();
    var closedInquiryList = await salesInquiryData.getClosedSalesInquiryList();
    //   if (req.session.admin) isLoggedIn = true;
    //   else isLoggedIn = false;

    return res
      .status(200)
      .render("saleshomepage", {
        activeSalesInquiryList: activeInquiryList,
        closedSalesInquiryList: closedInquiryList,
        title: "Sales Dashboard",
      });
    //   return res.status(200).render('saleshomepage', {title: "Sales Dashboard", isLoggedIn : isLoggedIn, haserror:haserror});
  } catch (error) {
    haserror = true;
    return res.status(400).render("error", { error: error });
    //return res.status(400).render("saleshomepage", { salesInquiryList: inquiryList, title: "Sales Dashboard"});
  }
  return res
    .status(500)
    .render("saleshomepage", {
      salesInquiryList: inquiryList,
      title: "Sales Dashboard",
    });
});

router.route("/sales/generateaccount/:id").get(async (req, res) => {
  let haserror = false;
  try {
    if (!req.session.user || req.session.user.role !== "sales representative") {
      return res.status(200).redirect("/");
    }
    // code here
    var status = await sendMail.generateCredentialsandsendmail(req.params.id);
    console.log(status);
    var update = await salesInquiryData.closeSalesInquiry(req.params.id);
    console.log(update);

    return res.redirect("/sales");
  } catch (error) {
    haserror = true;
    return res.status(400).render("error", { error: error });
  }
});

module.exports = router;

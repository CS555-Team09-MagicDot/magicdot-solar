const express = require("express");
const validators = require("../validators");
const users = require("../data/users");
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");

router.route("/").get(async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== "customer") {
      return res.status(200).redirect("/");
    }
    return res.status(200).render("customerHomepage", {
      title: "Customer Dashboard",
      user: req.session.user,
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
    pdfDoc
      .fontSize(20)
      .text(`Agreement for ${req.session.user.name}`, { underline: true });
    pdfDoc
      .fontSize(12)
      .text(
        "This agreement confirms that the customer has agreed to the terms and conditions set forth by the company."
      );
    pdfDoc.end();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = router;

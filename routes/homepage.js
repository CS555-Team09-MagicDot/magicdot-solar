const express = require("express");
const validators = require("../validators");
const users = require("../data/users");
const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    return res.status(200).render("homepage", { title: "Magicdot - Home" });
  } catch (e) {
    return res.status(e.status).render("homepage", { error: e.message });
  }
});

router
  .route("/login")
  .get(async (req, res) => {
    try {
      return res.status(200).render("login", { title: "Magicdot - Admin" });
    } catch (e) {
      return res.status(e.status).render("homepage", { error: e.message });
    }
  })
  .post(async (req, res) => {
    try {
      let data = req.body;
      data.email = validators.validateEmail(data.email);
      let userData = users.checkUser(data.email, data.password);
      return res.status(200).redirect("/admin");
    } catch (e) {
      return res.status(e.status).render("homepage", { error: e.message });
    }
  });

module.exports = router;

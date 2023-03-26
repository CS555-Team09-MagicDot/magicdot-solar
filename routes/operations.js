const express = require("express");
const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    return res.status(200).render("operationsDashboard", {
      title: "Operations Dashboard",
    });
  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

module.exports = router;

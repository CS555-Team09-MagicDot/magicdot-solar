const express = require('express');
const router = express.Router();

router.route("/").get(async (req, res) => {
    try {
        return res.status(200).render("homePage", {title:"Home Page"});
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
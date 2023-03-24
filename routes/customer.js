const express = require("express");
const validators = require("../validators");
const users = require("../data/users");
const router = express.Router();
const collections = require("../config/mongoCollections");
const usersSchema = collections.users;

router.route("/").get(async (req, res) => {
	try {
		return res.status(200).render("customerHomepage", { title: "Customer Dashboard", user: req.session.user });
	} catch (e) {
		//return res.status(e.status).render("homepage", { error: e.message });
        return console.log("Error")
	}
});

router.route("/documents").get(async (req, res) => {
	try {
        
        
		return res.status(200).render("customerAgreement", { title: "Customer Agreement", user: req.session.user });
	} catch (e) {
		//return res.status(e.status).render("homepage", { error: e.message });
        return console.log("Error")
	}
});

router.route("/customerAgreement").post(async (req, res) => {
    
    try {
        //const user = req.session.user
        //email = user.email

        
        
        // Find the customer by email and update their record
        const userCollection = await usersSchema();
        const email = req.body.email
        var myquery = { email: email };
        
        var newvalues = { $set: {isSigned: true}};
        const customer = await userCollection.updateOne(myquery, newvalues);
        
        // If the customer is not found, return a 404 error
        if (!customer) {
            return res.status(404).send('Customer not found');
        }
        req.session.user.isSigned=true
        // If the customer is updated successfully, return a success message
        return res.status(200).redirect("/customer");
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
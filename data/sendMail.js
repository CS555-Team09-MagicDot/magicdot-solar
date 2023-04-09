const nodemailer = require("nodemailer");
const usersData = require("./users");
const salesInquiryData = require("./salesInquiry");
const validators = require("../validators");
const generator = require("generate-password");

const generateCredentialsAndSendEmail = async (inquiryId, salesRepId) => {
	try {
		console.log(inquiryId);
		inquiryId = validators.validateId(inquiryId, "Sales Inquiry ID");
		const inquiryData = await salesInquiryData.getInquiryById(inquiryId);
		console.log(inquiryData);

		const password = generator.generate({
			length: 8,
			numbers: true,
			symbols: true,
			uppercase: true,
			lowercase: true,
			strict: true,
		});
		let phoneNumber = inquiryData.customerPhoneNumber;
		phoneNumber = phoneNumber.replace("-", "");
		console.log("UpdatedPhoneNumber", phoneNumber);
		console.log("password", password);
		const customerFirstName = inquiryData.customerName.split(" ")[0];
		const customerLastName = inquiryData.customerName.split(" ")[1];
		const newUser = await usersData.createUser(customerFirstName, customerLastName, "customer", inquiryData.customerEmail, inquiryData.customerPhoneNumber, password);
		const addInquiryInfoToCustomer = await usersData.addSalesInquiryIdToCustomer(newUser._id, inquiryId);
		const assignSalesRepToInquiry = await salesInquiryData.assignSalesRepToInquiry(inquiryData._id, salesRepId);
		const addCustomerIdToInquiry = await salesInquiryData.addCustomerIdToInquiry(inquiryData._id, newUser._id);
		const transporter = nodemailer.createTransport({
			service: "hotmail",
			auth: {
				user: "magicdot555@outlook.com",
				pass: "Agile@123",
			},
		});

		let mailoptions = {
			from: "magicdot555@outlook.com",
			to: inquiryData.customerEmail,
			subject: "New Account Credentials",
			html: `Hello ${inquiryData.customerName},<br><br>
                Your account has been created successfully. Here are your login credentials:<br>
                Email: ${inquiryData.customerEmail}<br>
                Password: ${password}<br><br>
                Best regards,<br>
                MagicDot`,
		};
		transporter.sendMail(mailoptions, function (error, info) {
			if (error) console.log(error);
		});

		return true;
	} catch (e) {
		console.log(e);
	}
};

module.exports = {
	generateCredentialsAndSendEmail,
};

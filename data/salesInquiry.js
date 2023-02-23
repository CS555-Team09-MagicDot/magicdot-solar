const collections = require("../config/mongoCollections");
const salesInquiry = collections.salesInquiry;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");

const newInquiry = async (firstName, lastName, email, phoneNumber, title, description) => {
	firstName = validators.valdiateName(firstName, "first name");
	lastName = validators.valdiateName(lastName, "last name");
	email = validators.validateEmail(email);
	phoneNumber = validators.validatePhone(phoneNumber);
	title = validators.validateTitle(title);
	description = validators.validateDescription(description);

	const inquiry = {
		customerName: `${firstName} ${lastName}`,
		customerEmail: email,
		customerPhoneNumber: phoneNumber,
		status: true,
		title: title,
		description: description,
		salesRepresentativeAssigned: {},
		messages: [],
	};

	const salesInquiryCollection = await salesInquiry();
	const insertInquiryInfo = await salesInquiryCollection.insertOne(inquiry);
	if (!insertInquiryInfo.acknowledged || !insertInquiryInfo.insertedId) throw { status: 500, message: "Could not create new inquiry" };

	const newInquiryInfo = await getInquiryById(insertInquiryInfo.insertedId.toString());
	return newInquiryInfo;
};

const getInquiryById = async (id) => {
	id = validators.validateId(id, "inquiry");
	const salesInquiryCollection = await salesInquiry();
	const getInquiry = salesInquiryCollection.findOne({ _id: ObjectId(id) });
	if (!getInquiry) throw { status: 404, message: "Inquiry not found" };
	getInquiry._id = getInquiry._id.toString();
	return getInquiry;
};

const closeSalesInquiry = async (id) => {
	id = validators.validateId(id, "inquiry");
	const salesInquiryCollection = await salesInquiry();
	const closeInquiry = await salesInquiryCollection.updateOne({ _id: ObjectId(id) }, { $set: { status: false } });
	if (closeInquiry.modifiedCount === 0) throw { status: 500, message: "Could not close inquiry" };
	const updatedInquiry = await getInquiryById(id);
	return updatedInquiry;
};

module.exports = {
	newInquiry,
	getInquiryById,
	closeSalesInquiry,
};

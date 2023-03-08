const collections = require("../config/mongoCollections");
const salesInquiry = collections.salesInquiry;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");

const newInquiry = async (firstName, lastName, email, phoneNumber, subject, message) => {
	firstName = validators.validateName(firstName, "first name");
	lastName = validators.validateName(lastName, "last name");
	email = validators.validateEmail(email);
	phoneNumber = validators.validatePhone(phoneNumber);
	subject = validators.validateSubject(subject);
	message = validators.validateMessage(message);

	const inquiry = {
		customerName: `${firstName} ${lastName}`,
		customerEmail: email,
		customerPhoneNumber: phoneNumber,
		status: true,
		subject: subject,
		message: message,
		salesRepresentativeAssigned: {},
		messages: [],
	};

	const salesInquiryCollection = await salesInquiry();
	const insertInquiryInfo = await salesInquiryCollection.insertOne(inquiry);
	if (!insertInquiryInfo.acknowledged || !insertInquiryInfo.insertedId) throw { status: 500, message: "Could not create new inquiry" };

	return true;
};

const newInquiry2 = async (customerName, customerEmail, customerPhoneNumber, subject, message) => {
	const salesInquiryCollection = await salesInquiry();

	const inquiry = {
		customerName: customerName,
		customerEmail: customerEmail,
		customerPhoneNumber: customerPhoneNumber,
		status: true,
		subject: subject,
		message: message,
		salesRepresentativeAssigned: {},
		messages: [],
	};

	const insertInfo = await salesInquiryCollection.insertOne(inquiry);

	if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not create inquiry";

	const newId = insertInfo.insertedId.toString();
	const inq = await getInquiryById(newId);
	return inq;
};

async function getSalesInquiryList() {
	const salesInquiryCollection = await salesInquiry();
	const inquiryList = await salesInquiryCollection.find({}).toArray();

	if (inquiryList === null) return [];
	for (i in inquiryList) {
		inquiryList[i]._id = inquiryList[i]._id.toString();
	}
	return inquiryList;
}

const getInquiryById = async (id) => {
	// id = validators.validateId(id, "inquiry");
	const salesInquiryCollection = await salesInquiry();
	const getInquiry = salesInquiryCollection.findOne({ _id: new ObjectId(id) });
	if (!getInquiry || getInquiry === null) throw { status: 404, message: "Inquiry not found" };
	//getInquiry._id = getInquiry._id.toString();
	return getInquiry;
};

const getInquiry = async (filters) => {
	const { firstName, secondName, email, phoneNumber, search } = filters;
	const findQuery = {};
	findQuery["firstName"] = { $regex: search || firstName, $options: "i" };
	findQuery["secondName"] = { $regex: search || secondName, $options: "i" };
	findQuery["email"] = { $regex: search || email, $options: "i" };
	findQuery["phoneNumber"] = { $regex: search || phoneNumber, $options: "i" };
	const getInquiries = salesInquiryCollection.find(findQuery);
	if (!getInquiry) throw { status: 404, message: "Inquiry not found" };
	getInquiries = getInquiries.map((inq) => {
		inq._id = inq._id.toString();
		return inq;
	});
	return getInquiries;
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
	newInquiry2,
	getSalesInquiryList,
	getInquiryById,
	closeSalesInquiry,
};

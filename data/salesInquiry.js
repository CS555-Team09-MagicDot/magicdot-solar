const collections = require("../config/mongoCollections");
const salesInquiry = collections.salesInquiry;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");
const util = require("util");

const newInquiry = async (firstName, lastName, email, phoneNumber, subject, message, files) => {
	firstName = validators.validateName(firstName, "first name");
	lastName = validators.validateName(lastName, "last name");
	email = validators.validateEmail(email);
	phoneNumber = validators.validatePhone(phoneNumber);
	subject = validators.validateSubject(subject);
	message = validators.validateMessage(message);
	let imageArray = new Array();
	if (files) {
		const { images } = files;
		if (Array.isArray(images)) {
			imageArray = images.map((image) => `data:${image.mimetype};base64,${image.data.toString("base64")}`);
		} else {
			imageArray.push(`data:${images.mimetype};base64,${images.data.toString("base64")}`);
		}
	}

	const inquiry = {
		customerId: "",
		customerName: `${firstName} ${lastName}`,
		customerEmail: email,
		customerPhoneNumber: phoneNumber,
		status: true,
		subject: subject,
		message: message,
		initialImages: imageArray,
		salesRepresentativeAssigned: "",
		messages: [],
	};

	const salesInquiryCollection = await salesInquiry();
	const insertInquiryInfo = await salesInquiryCollection.insertOne(inquiry);
	if (!insertInquiryInfo.acknowledged || !insertInquiryInfo.insertedId) throw { status: 500, message: "Could not create new inquiry" };
	const insertedInquiry = await getInquiryById(insertInquiryInfo.insertedId.toString());

	return insertedInquiry;
};

const assignSalesRepToInquiry = async (inquiryId, salesRepId) => {
	inquiryId = validators.validateId(inquiryId, "Sales Inquiry ID");
	salesRepId = validators.validateId(salesRepId, "Sales Rep ID");
	const salesInquiryCollection = await salesInquiry();
	const updateInquiry = await salesInquiryCollection.updateOne(
		{ _id: new ObjectId(inquiryId) },
		{ $set: { salesRepresentativeAssigned: salesRepId } }
	);
	if (!updateInquiry.acknowledged || !updateInquiry.matchedCount) throw { status: 500, message: "Could not assign sales representative" };
	return true;
};

const addCustomerIdToInquiry = async (inquiryId, customerId) => {
	inquiryId = validators.validateId(inquiryId, "Sales Inquiry ID");
	customerId = validators.validateId(customerId, "Customer ID");
	const salesInquiryCollection = await salesInquiry();
	const updateInquiry = await salesInquiryCollection.updateOne({ _id: new ObjectId(inquiryId) }, { $set: { customerId: customerId } });
	if (!updateInquiry.acknowledged || !updateInquiry.matchedCount) throw { status: 500, message: "Could not assign customer" };
	return true;
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

async function totalInquiriesAmount() {
	const salesInquiryCollection = await salesInquiry();
	const totalDocuments = await salesInquiryCollection.find({}).toArray();
	return totalDocuments.length;
}

async function getNewSalesInquiryList() {
	const salesInquiryCollection = await salesInquiry();
	const inquiryList = await salesInquiryCollection.find({ salesRepresentativeAssigned: "" }).toArray();

	if (inquiryList === null) return [];
	for (i in inquiryList) {
		inquiryList[i]._id = inquiryList[i]._id.toString();
	}
	return inquiryList;
}

const getOngoingInquiryList = async (salesRepId) => {
	const salesInquiryCollection = await salesInquiry();
	const inquiryList = await salesInquiryCollection.find({ salesRepresentativeAssigned: salesRepId }).toArray();
	if (!inquiryList) return [];
	for (i in inquiryList) {
		inquiryList[i]._id = inquiryList[i]._id.toString();
	}
	return inquiryList;
};

async function getClosedSalesInquiryList() {
	const salesInquiryCollection = await salesInquiry();
	const inquiryList = await salesInquiryCollection.find({ status: false }).toArray();

	if (inquiryList === null) return [];
	for (i in inquiryList) {
		inquiryList[i]._id = inquiryList[i]._id.toString();
	}
	return inquiryList;
}

const getInquiryById = async (id) => {
	id = validators.validateId(id, "inquiry");
	const salesInquiryCollection = await salesInquiry();
	const getInquiry = await salesInquiryCollection.findOne({ _id: new ObjectId(id) });
	if (!getInquiry || getInquiry === null) throw { status: 404, message: "Inquiry not found" };
	getInquiry._id = getInquiry._id.toString();
	return getInquiry;
};

const getInquiry = async (filters) => {
	const { firstName, secondName, email, phoneNumber, search } = filters;
	const findQuery = {};
	findQuery["firstName"] = { $regex: search || firstName || "", $options: "i" };
	findQuery["secondName"] = {
		$regex: search || secondName || "",
		$options: "i",
	};
	findQuery["email"] = { $regex: search || email || "", $options: "i" };
	findQuery["phoneNumber"] = {
		$regex: search || phoneNumber || "",
		$options: "i",
	};
	const salesInquiryCollection = await salesInquiry();
	let getInquiries = await salesInquiryCollection.find(findQuery).pretty();
	if (!getInquiry) throw { status: 404, message: "Inquiry not found" };
	getInquiries = getInquiries.map((inq) => {
		inq._id = inq._id.toString();
		return inq;
	});
	return getInquiries;
};

const addNewMessage = async (inquiryId, userId, message, files) => {
	inquiryId = validators.validateId(inquiryId, "Sales Inquiry ID");
	userId = validators.validateId(userId, "User ID");
	message = validators.validateString(message, "Message");
	let imageArray = new Array();
	if (files) {
		const { images } = files;
		if (Array.isArray(images)) {
			imageArray = images.map((image) => `data:${image.mimetype};base64,${image.data.toString("base64")}`);
		} else {
			imageArray.push(`data:${images.mimetype};base64,${images.data.toString("base64")}`);
		}
	}

	const newMessage = {
		_id: new ObjectId(),
		date: new Date().toLocaleString("en-US"),
		userId: userId,
		message: message,
		images: imageArray,
	};
	console.log(`Pushing message object:\n${util.inspect(newMessage, true, undefined)}`);
	const salesInquiryCollection = await salesInquiry();
	const updateInquiry = await salesInquiryCollection.updateOne({ _id: new ObjectId(inquiryId) }, { $push: { messages: newMessage } });
	if (!updateInquiry.acknowledged || !updateInquiry.matchedCount) throw { status: 500, message: "Could not add new message" };
	return true;
};

const getInquiryMessages = async (inquiryId) => {
	inquiryId = validators.validateId(inquiryId, "Sales Inquiry ID");
	const salesInquiryCollection = await salesInquiry();
	const getInquiry = await salesInquiryCollection.findOne({ _id: new ObjectId(inquiryId) });
	if (!getInquiry || getInquiry === null) throw { status: 404, message: "Inquiry not found" };
	const messages = getInquiry.messages;
	return messages;
};

const closeSalesInquiry = async (id) => {
	id = validators.validateId(id, "inquiry");
	const salesInquiryCollection = await salesInquiry();
	const closeInquiry = await salesInquiryCollection.updateOne({ _id: new ObjectId(id) }, { $set: { status: false } });
	if (closeInquiry.modifiedCount === 0) throw { status: 500, message: "Could not close inquiry" };
	const updatedInquiry = await getInquiryById(id);
	return updatedInquiry;
};

module.exports = {
	newInquiry,
	assignSalesRepToInquiry,
	addCustomerIdToInquiry,
	getSalesInquiryList,
	totalInquiriesAmount,
	getNewSalesInquiryList,
	getOngoingInquiryList,
	getClosedSalesInquiryList,
	getInquiryById,
	getInquiry,
	addNewMessage,
	getInquiryMessages,
	closeSalesInquiry,
};

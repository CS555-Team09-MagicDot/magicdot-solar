const collections = require("../config/mongoCollections");
const salesInquiry = collections.salesInquiry;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");

const newInquiry = async (reqBody) => {
	reqBody.firstName = validators.validateName(reqBody.firstName, "first name");
	reqBody.lastName = validators.validateName(reqBody.lastName, "last name");
	reqBody.email = validators.validateEmail(reqBody.email);
	reqBody.phoneNumber = validators.validatePhone(reqBody.phoneNumber);
	reqBody.subject = validators.validateSubject(reqBody.subject);
	reqBody.message = validators.validateMessage(reqBody.message);

	const inquiry = {
		customerName: `${reqBody.firstName} ${reqBody.lastName}`,
		customerEmail: reqBody.email,
		customerPhoneNumber: reqBody.phoneNumber,
		status: true,
		subject: reqBody.subject,
		message: reqBody.message,
		salesRepresentativeAssigned: {},
		messages: [],
	};

	const salesInquiryCollection = await salesInquiry();
	const insertInquiryInfo = await salesInquiryCollection.insertOne(inquiry);
	if (!insertInquiryInfo.acknowledged || !insertInquiryInfo.insertedId) throw { status: 500, message: "Could not create new inquiry" };

	return true;
};

const getInquiryById = async (id) => {
	id = validators.validateId(id, "inquiry");
	const salesInquiryCollection = await salesInquiry();
	const getInquiry = salesInquiryCollection.findOne({ _id: ObjectId(id) });
	if (!getInquiry) throw { status: 404, message: "Inquiry not found" };
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
	getInquiry,
	closeSalesInquiry,
};

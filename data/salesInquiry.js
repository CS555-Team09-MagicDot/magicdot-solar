const collections = require("../config/mongoCollections");
const salesInquiry = collections.salesInquiry;
const {ObjectId} = require('mongodb');
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


const newInquiry2 = async (
	customerName,
	customerEmail,
	customerPhoneNumber,
	subject,
	message
  ) => {

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

	if (!insertInfo.acknowledged || !insertInfo.insertedId)
	  throw 'Could not create inquiry';
  
	const newId = insertInfo.insertedId.toString();
	const inq = await getInquiryById(newId);  
	return inq;
  };

async function getSalesInquiryList(){
	const salesInquiryCollection = await salesInquiry();
    const inquiryList = await salesInquiryCollection.find({}).toArray();

	if (inquiryList === null) return [];
	for(i in inquiryList){
    	inquiryList[i]._id = inquiryList[i]._id.toString();
  	}
    return inquiryList;
}

const getInquiryById = async (id) => {
	// id = validators.validateId(id, "inquiry");
	const salesInquiryCollection = await salesInquiry();
	const getInquiry = salesInquiryCollection.findOne({ _id: new ObjectId(id) });
	if (!getInquiry || getInquiry===null) throw { status: 404, message: "Inquiry not found" };
	//getInquiry._id = getInquiry._id.toString();
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
	newInquiry2,
	getSalesInquiryList,
	getInquiryById,
	closeSalesInquiry,
};
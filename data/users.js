const collections = require("../config/mongoCollections");
const users = collections.users;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const projectData = require("./project");

const createUser = async (firstName, lastName, role, email, phoneNumber, password) => {
	firstName = validators.validateName(firstName, "first name");
	lastName = validators.validateName(lastName, "last name");
	role = validators.validateRole(role);
	email = validators.validateEmail(email);
	phoneNumber = validators.validatePhone(phoneNumber);
	password = validators.validatePassword(password);

	const userCollection = await users();
	if (await userCollection.findOne({ email: email })) throw { status: 400, message: `An account with that email already exists` };
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const newUser = {
		name: `${firstName} ${lastName}`,
		role: role,
		email: email,
		phoneNumber: phoneNumber,
		password: hashedPassword,
		customerInquiry: "",
		salesInquiries: [],
		ongoingProjects: [],
		finishedProjects: [],
		isSigned: false,
		signedDate: null,
	};
	const insertUserInfo = await userCollection.insertOne(newUser);
	if (!insertUserInfo.acknowledged || !insertUserInfo.insertedId) throw { status: 500, message: "Could not create new user" };

	const newUserInfo = await getUserById(insertUserInfo.insertedId.toString());
	const sendUserInfo = {
		_id: newUserInfo._id,
		name: newUserInfo.name,
		role: newUserInfo.role,
		email: newUserInfo.email,
		phoneNumber: newUserInfo.phoneNumber,
		password: newUserInfo.password,
		isSigned: newUserInfo.isSigned,
		signedDate: newUserInfo.signedDate,
	};
	return sendUserInfo;
};

const getUserById = async (userId) => {
	userId = validators.validateId(userId, "user");
	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(userId) });
	if (!user) throw { status: 404, message: "User not found" };
	user._id = user._id.toString();
	return user;
};
const getUserByEmail = async (userEmail) => {
	userEmail = validators.validateEmail(userEmail);
	const userCollection = await users();
	const user = await userCollection.findOne({ email: userEmail });
	if (!user) {
		return false;
	}
	console.log("After Negation");
	user._id = user._id.toString();
	return user;
};

const checkUser = async (email, password) => {
	if (!email || !password) throw { status: 400, message: "Must provide both email and password" };
	const userCollection = await users();
	const user = await userCollection.findOne({ email: email });
	if (!user) throw { status: 400, message: "Incorrect email or password" };

	const checkMatch = await bcrypt.compare(password, user.password);
	if (!checkMatch) throw { status: 400, message: "Incorrect email or password" };

	const sendUserInfo = {
		_id: user._id.toString(),
		name: user.name,
		role: user.role,
		email: user.email,
		phoneNumber: user.phoneNumber,
		isSigned: user.isSigned,
		signedDate: user.signedDate,
	};
	
	return sendUserInfo;
};

const checkUserAgreement = async (email, datePicker ) => {
	const userCollection = await users();
	

	var myQuery = { email: email };

	var newValues = { $set: { isSigned: true, signedDate: datePicker } };
	const customer = await userCollection.updateOne(myQuery, newValues);
	return customer;
};

const addSalesInquiryIdToCustomer = async (customerId, inquiryId) => {
	customerId = validators.validateId(customerId, "customer");
	inquiryId = validators.validateId(inquiryId, "inquiry");
	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(customerId) });
	if (!user) throw { status: 404, message: "Customer not found" };
	const customerInquiry = await userCollection.updateOne({ _id: new ObjectId(customerId) }, { $set: { customerInquiry: inquiryId } });
	return customerInquiry;
};

const addProjectToUser = async (projectId, userId) => {
	const userInfo = await getUserById(userId);
	var arr = userInfo.ongoingProjects;
	arr.push(projectId);

	var query = { _id: new ObjectId(userId) };
	newValue = { $set: { ongoingProjects: arr } };

	const usersCollection = await users();
	const updateInfo = await usersCollection.updateOne(query, newValue);

	// console.log(updateInfo);
	return await getUserById(userId);
};

const getUsersOnGoingProjects = async (id) => {
	//console.log(id);
	const userInfo = await getUserById(id);
	// console.log(userInfo.ongoingProjects);

	let list = [];
	for (let i = 0; i < userInfo.ongoingProjects.length; i++) {
		let obj = userInfo.ongoingProjects[i];
		console.log(obj);
		const projectDetails = await projectData.getProjectById(obj);
		list.push(projectDetails);
	}

	return list;
};

module.exports = {
	createUser,
	getUserById,
	checkUser,
	checkUserAgreement,
	getUserByEmail,
	addSalesInquiryIdToCustomer,
	addProjectToUser,
	getUsersOnGoingProjects,
};

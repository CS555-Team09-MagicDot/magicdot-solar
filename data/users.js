const collections = require("../config/mongoCollections");
const users = collections.users;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const createUser = async (firstName, lastName, role, email, phoneNumber, password) => {
	firstName = validators.validateName(firstName, "first name");
	lastName = validators.validateName(lastName, "last name");
	role = validators.validateRole(role);
	email = validators.validateEmail(email);
	phoneNumber = validators.validatePhone(phoneNumber);
	//password = validators.validatePassword(password);

	const userCollection = await users();
	if (await userCollection.findOne({ email: email })) throw { status: 400, message: `An account with that email already exists` };
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const newUser = {
		name: `${firstName} ${lastName}`,
		role: role,
		email: email,
		phoneNumber: phoneNumber,
		password: hashedPassword,
		salesInquiries: [],
		ongoingProjects: [],
		finishedProjects: [],
		isSigned: false
	};
	const insertUserInfo = await userCollection.insertOne(newUser);
	if (!insertUserInfo.acknowledged || !insertUserInfo.insertedId) throw { status: 500, message: "Could not create new user" };

	const newUserInfo = await getUserById(insertUserInfo.insertedId.toString());
	const sendUserInfo = {
		_id: newUserInfo._id,
		name: newUserInfo.name,
		role: role,
		email: newUserInfo.email,
		phoneNumber: newUserInfo.phoneNumber,
		isSigned: newUserInfo.isSigned,
		

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
	};
	return sendUserInfo;
};

const checkUserAgreement = async(email)=>{

	const userCollection = await users();
	
	var myquery = { email: email };
	
	var newvalues = { $set: {isSigned: true}};
	const customer = await userCollection.updateOne(myquery, newvalues);
	return customer;

};

module.exports = {
	createUser,
	getUserById,
	checkUser,
	checkUserAgreement,
};

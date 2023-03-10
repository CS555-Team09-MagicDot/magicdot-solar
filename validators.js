const ObjectId = require("mongodb").ObjectId;

const validateString = (str, field) => {
	if (!str) throw { status: 400, message: `Must provide a string for ${field}` };
	if (typeof str !== "string") throw { status: 400, message: `${field} must be a string` };
	str = str.trim();
	if (str.length < 1) throw { status: 400, message: `${field} cannot be empty string or just spaces` };
	return str;
};

const validateId = (id, field) => {
	if (!id) throw { status: 400, message: `Must provide an ID for ${field}` };
	id = validateString(id, "ID");
	if (!ObjectId.isValid(id)) throw { status: 400, message: `Input is an invalid ID for ${field}` };
	return id;
};

const validateName = (name, type) => {
	name = validateString(name);
	if (name.length < 2) throw { status: 400, message: `${type} must be at least 2 characters` };
	const regex = /[^A-z\s'"]/g;
	if (regex.test(name) || name.includes("_")) throw { status: 400, message: `${type} must not contain special characters` };
	return name;
};

const validateRole = (role) => {
	role = validateString(role, "role");
	role = role.toLowerCase();
	if (!["admin", "operational manager", "onsite team", "sales representative", "customer"].includes(role)) throw { status: 400, message: "Input is not a valid role" };
	return role;
};

const validateEmail = (email) => {
	email = validateString(email, "string");
	email = email.toLowerCase();
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		email = email.trim();
		return email;
	} else {
		throw { status: 400, message: "Invalid email format" };
	}
};

const validatePhone = (phone) => {
	if (!phone || phone === "N/A" || phone.length === 0) return "N/A";
	const regex = /[^0-9]/;
	phone = phone.trim();
	if (regex.test(phone)) throw { status: 400, message: "Phone number must contain only integer number" };
	if (phone.length !== 10) throw { status: 400, message: "Phone number must have 10 digits" };
	if (!parseInt(phone)) throw { status: 400, message: "Phone must be a 10 digits number" };
	return phone;
};

const validateSubject = (subject) => {
	if (!subject) throw { status: 400, message: "Must provide a job subject" };
	if (typeof subject !== "string") throw { status: 400, message: "Job subject must be a string" };
	subject = subject.trim();
	if (subject.length === 0) throw { status: 400, message: "Job subject cannot be empty spaces" };
	if (subject.match("/[^ws]/g") || subject.includes("_")) throw { status: 400, message: "Job subject can only contain alphanumeric characters" };
	if (subject.length < 3) throw { status: 400, message: "Job subject must be at least 3 characters long" };
	return subject;
};

const validateMessage = (message) => {
	message = validateString(message, "message");
	if (message.length === 0) throw { status: 400, message: "Description cannot be empty spaces" };
	if (message.split(" ").length < 5) throw { status: 400, message: "Description must have at least 5 words" };

	return message;
};

const validatePassword = (password) => {
	const oneUpper = /[A-Z]/;
	const oneLower = /[a-z]/;
	const oneNumber = /[0-9]/;
	const specialChar = /[^\w\s]/;
	password = validateString(password, "password");
	password = password.trim();
	if (password.length === 0) throw { status: 400, message: "Password cannot be an empty string or string with just spaces" };
	if (password.length < 8) throw { status: 400, message: "Password must at least 8 characters long" };
	if (password.includes(" ")) throw { status: 400, message: "Password must not contain space" };
	if (!oneUpper.test(password)) throw { status: 400, message: "Password must contain one upper case" };
	if (!oneLower.test(password)) throw { status: 400, message: "Password must contain one lower case letter" };
	if (!oneNumber.test(password)) throw { status: 400, message: "Password must contain one number" };
	if (!specialChar.test(password) && !password.includes("_")) throw { status: 400, message: "Password must contain one special character" };
	return password;
};

module.exports = {
	validateString,
	validateId,
	validateName,
	validateRole,
	validateEmail,
	validatePhone,
	validateSubject,
	validateMessage,
	validatePassword,
};

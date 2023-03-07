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

// TODO: write validation conditions
const validateName = (name, type) => {
	return name;
};

const validateRole = (role) => {
	role = validateString(role, "role");
	role = role.toLowerCase();
	if (!["admin", "operational manager", "onsite team", "sales representative", "customer"].includes(role)) throw { status: 400, message: "Input is not a valid role" };
	return role;
};

// TODO: write validation conditions
const validateEmail = (email) => {
	email = validateString(email, "email");
	email = email.toLowerCase();
	return email;
};

// TODO: write validation conditions
const validatePhone = (phone) => {
	return phone;
};

// TODO: write validation conditions
const validateSubject = (subject) => {
	return subject;
};

// TODO: write validation conditions
const validateMessage = (message) => {
	return message;
};

// TODO: write validation conditions
const validatePassword = (password) => {
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

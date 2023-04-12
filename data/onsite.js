const collections = require("../config/mongoCollections");
const usersCollection = collections.users;
const projectsCollection = collections.projects;
const usersData = require("./users");
const ObjectId = require("mongodb").ObjectId;

const getCustomerOnGoingProjects = async (id) => {
	//console.log(id);
	const user = await usersData.getUserById(id);
	console.log(user.ongoingProjects);
};

const getCustomerFinishedProjects = async (id) => {
	const user = await usersData.getUserById(id);
	console.log(user.finishedProjects);
};

module.exports = {
	getCustomerFinishedProjects,
	getCustomerOnGoingProjects,
};

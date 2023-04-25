const collections = require("../config/mongoCollections");
const projects = collections.projects;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");

const getApprovedProjects = async () => {
	const projectCollection = await projects();
	const approvedProjects = await projectCollection.find({ status: "approved" }).toArray();
	return approvedProjects;
};

const getPendingProjects = async () => {
	const projectCollection = await projects();
	const pendingProjects = await projectCollection.find({ approvalStatus: "pending" }).toArray();
	return pendingProjects;
};

const createProject = async (name, description, startDate, endDate, status, approvalStatus, salesRep, constructionCrew, operationsManager, customer) => {
	// Validate inputs
	//name = validateString(name, 'name');
	// description = validateMessage(description, 'description');
	// startDate = validateString(startDate, 'start date');
	// endDate = validateString(endDate, 'end date');
	// status = validateString(status, 'status');
	// assignedTo = validateString(assignedTo);

	// Connect to database
	const projectsCollection = await projects();

	// Check if project with the same name already exists
	const existingProject = await projectsCollection.findOne({ name });
	if (existingProject) {
		throw { status: 400, message: `A project with the name "${name}" already exists` };
	}
	const newProject = {
		name: name,
		description: description,
		startDate: startDate,
		endDate: endDate,
		status: status,
		approvalStatus: approvalStatus,
		salesRep: salesRep,
		constructionCrew: constructionCrew,
		operationsManager: operationsManager,
		customer: customer,
	};

	// Insert new project
	const insertProjectInfo = await projectsCollection.insertOne(newProject);
	if (!insertProjectInfo.acknowledged || !insertProjectInfo.insertedId) throw { status: 500, message: "Could not create new project" };

	const newProjectInfo = await getProjectById(insertProjectInfo.insertedId.toString());
	const sendProjectInfo = {
		_id: newProjectInfo._id,
		name: newProjectInfo.name,
		description: newProjectInfo.description,
		startDate: newProjectInfo.startDate,
		endDate: newProjectInfo.endDate,
		status: newProjectInfo.status,
		approvalStatus: newProjectInfo.approvalStatus,
		salesRep: newProjectInfo.salesRep,
		constructionCrew: newProjectInfo.constructionCrew,
		operationsManager: newProjectInfo.operationsManager,
		customer: newProjectInfo.customer,
	};
	return sendProjectInfo;
};

const getProjectById = async (projectId) => {
	projectId = validators.validateId(projectId, "project ID");
	const projectCollection = await projects();
	const project = await projectCollection.findOne({ _id: new ObjectId(projectId) });
	if (!project) throw { status: 404, message: "Project not found" };
	project._id = project._id.toString();
	return project;
};

const getAllProjects = async () => {
	const projectCollection = await projects();
	const arr = await projectCollection.find({}).toArray();
	if (arr === null) return [];
	for (i in arr) {
		arr[i]._id = arr[i]._id.toString();
	}
	return arr;
};

const getProjectsByConstructionCrew = async (constructionCrew) => {
	const projectCollection = await projects();
	const projectsByCrew = await projectCollection.find({ constructionCrew: constructionCrew }).toArray();
	if (projectsByCrew === null) return [];
	for (i in projectsByCrew) {
		projectsByCrew[i]._id = projectsByCrew[i]._id.toString();
	}
	return projectsByCrew;
};

const createProjectUsingRequest = async (reqObj, operationalManagerId) => {
	let currentDate = new Date();
	const newProject = {
		name: reqObj.subject,
		customerId: reqObj.customerId,
		salesRepresentative: reqObj.salesRepresentative,
		area: reqObj.area,
		annualUsage: reqObj.annualUsage,
		annualCost: reqObj.annualCost,
		address: reqObj.address,
		startDate: `${currentDate.toLocaleDateString("en-US")},${currentDate.toLocaleTimeString("en-US")}`,
		endDate: null,
		status: "approved",
		constructionCrew: null,
		operationsManager: operationalManagerId,
	};

	const projectsCollection = await projects();

	const newProjectInfo = await projectsCollection.insertOne(newProject);
	if (!newProjectInfo.acknowledged || !newProjectInfo.insertedId) throw { status: 500, message: "Could not create Project" };
  
	const projectCreated = getProjectById(newProjectInfo.insertedId.toString());
	return projectCreated;
};

module.exports = {
	getApprovedProjects,
	getPendingProjects,
	createProject,
	getAllProjects,
	getProjectById,
	getProjectsByConstructionCrew,
	createProjectUsingRequest,
};

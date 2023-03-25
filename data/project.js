const collections = require("../config/mongoCollections");
const projects = collections.projects;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");

const getApprovedProjects = async () => {
	const projectCollection = await projects();
	const approvedProjects = await projectCollection.find({ approvalStatus: "approved" }).toArray();
	return approvedProjects
};

const getPendingProjects = async () => {
	const projectCollection = await projects();
	const pendingProjects = await projectCollection.find({ approvalStatus: "pending" }).toArray();
	return pendingProjects
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
	//projectId = validators.validateId(userId, "user");
	const projectCollection = await projects();
	const project = await projectCollection.findOne({ _id: new ObjectId(projectId) });
	if (!project) throw { status: 404, message: "Project not found" };
	project._id = project._id.toString();
	return project;
};

module.exports = {
	getApprovedProjects,
	getPendingProjects,
    createProject
};
//getPendingProjects();
getApprovedProjects();

const collections = require("../config/mongoCollections");
const projectRequest = collections.projectRequest;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");

const createProjectRequest = async (inquiryId, area, annualUsage, annualCost, address) => {

	// name = validators.validateName(name, "Inventory name");
	// quantity = validators.validateName(quantity, "Quantity");

	const newProjectRequest = {
		inquiryId: inquiryId,
		area: area,
        annualUsage: annualUsage,
        annualCost: annualCost,
        address: address,
        status: true
	};

	const projectRequestCollection = await projectRequest();
	const newProjectRequestInfo = await projectRequestCollection.insertOne(newProjectRequest);
	if (!newProjectRequestInfo.acknowledged || !newProjectRequestInfo.insertedId) throw { status: 500, message: "Could not create Project Request"};

    console.log(newProjectRequestInfo)
	return true;
};

const getProjectRequestById = async (id) => {
	// id = validators.validateId(id, "Project Request");
	const projectRequestCollection = await projectRequest();
	const getProjectReq = projectRequestCollection.findOne({ _id: new ObjectId(id) });
	if (!getProjectReq || getProjectReq === null) throw { status: 404, message: "Project Request not found" };
	//getProjectReq._id = getProjectReq._id.toString();
	return getProjectReq;
};

module.exports = {
    createProjectRequest,
    getProjectRequestById
}
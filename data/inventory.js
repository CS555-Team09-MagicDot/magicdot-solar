const collections = require("../config/mongoCollections");
const inventory = collections.inventory;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");

const createNewInventory = async (name, quantity) => {

	name = validators.validateName(name, "Inventory name");
	//quantity = validators.validateName(quantity, "Quantity");

	const newInventory = {
		name: name,
		quantity: quantity
	};

	const inventoryCollection = await inventory();
	const newInventoryInfo = await inventoryCollection.insertOne(newInventory);
	if (!newInventoryInfo.acknowledged || !newInventoryInfo.insertedId) throw { status: 500, message: "Could not create new inventory"};

	return true;
};


const getAllInventoryList = async () => {
	const inventoryCollection = await inventory();
	const inventoryList = await inventoryCollection.find({}).toArray();

	if (inventoryList === null) return [];
	for (i in inventoryList) {
		inventoryList[i]._id = inventoryList[i]._id.toString();
		inventoryList[i].id = inventoryList[i]._id.toString();
	}
	return inventoryList;
};

const getInventoryById = async (id) => {
	// id = validators.validateId(id, "inventory");
	const inventoryCollection = await inventory();
	const getInventory = inventoryCollection.findOne({ _id: new ObjectId(id) });
	if (!getInventory || getInventory === null) throw { status: 404, message: "Inventory not found" };
	//getInventory._id = getInventory._id.toString();
	return getInventory;
};

const updateInventoryQuantity = async (id, quantity) => {
	// id = validators.validateId(id, "inventory");
	const inventoryCollection = await inventory();

    var query = { _id: new ObjectId(id) };
    newValue = {$set: {quantity: quantity}};

	const updateInfo = await inventoryCollection.updateOne(query, newValue);

	return await getInventoryById(id);
};

module.exports = {
    createNewInventory,
    getAllInventoryList,
    getInventoryById,
    updateInventoryQuantity
}

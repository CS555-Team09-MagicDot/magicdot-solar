const connection = require("./config/mongoConnection");
const salesInquiry = require("./data/salesInquiry");
const usersData = require("./data/users");
const projectsData = require("./data/project");
const inventoryData = require("./data/inventory");

async function main() {
	const db = await connection.dbConnection();

	await db.dropDatabase();

	try {
		const inquiry1 = await salesInquiry.newInquiry("Hem", "Patel", "hempatel1234@gmail.com", "9871361803", "Solar Home Rooftop", "I want to install solar system");
		console.log(inquiry1);
	} catch (e) {
		console.log(e);
	}

	try {
		const inquiry2 = await salesInquiry.newInquiry("Jay", "Patel", "patelj1799@gmail.com", "9871361803", "Solar System", "I want to install solar system");
		console.log(inquiry2);
	} catch (e) {
		console.log(e);
	}

	try {
		const user1 = await usersData.createUser("Sales", "Account", "sales representative", "sales@gmail.com", "7698654321", "Sales@123");
		console.log(user1);
	} catch (e) {
		console.log(e);
	}

	try {
		const user2 = await usersData.createUser("Operations", "Account", "operational manager", "operations@gmail.com", "7698654321", "Test@123");
		console.log(user2);
	} catch (e) {
		console.log(e);
	}

	try {
		const itAdmin1 = await usersData.createUser("ItAdmin", "Account", "it admin", "it@gmail.com", "7698654321", "Test@123");
		console.log(itAdmin1);
	} catch (e) {
		console.log(e);
	}

	try {
		const customer1 = await usersData.createUser("customer", "Account", "customer", "customer@gmail.com", "7698654321", "Test@123");
		console.log(customer1);
	} catch (e) {
		console.log(e);
	}

	try {
		const inventory1 = await inventoryData.createNewInventory("Solar Panel", "892");
		console.log(inventory1);
	} catch (e) {
		console.log(e);
	}

	try {
		const inventory2 = await inventoryData.createNewInventory("Battery 15 kWh", "1263");
		console.log(inventory2);
	} catch (e) {
		console.log(e);
	}

	try {
		const inventory3 = await inventoryData.createNewInventory("Inverter", "275");
		console.log(inventory3);
	} catch (e) {
		console.log(e);
	}

	try {
		const newProject = await projectsData.createProject("Project-23456", "description", "03/12/2020", "04/10/2021", "ongoing", "approved", "xyz person", "Aplha", "abc", "qwe");
		console.log(newProject);
	} catch (e) {
		console.log(e);
	}

	// try {
	// 	const update = await inventoryData.updateInventoryQuantity("6430e479e2e28496a79dba70", "500");
	// 	console.log(update);
	// } catch (e) {
	// 	console.log(e);
	// }

	await connection.closeConnection();
	console.log("Seed Executed");
}

main();
const connection = require("./config/mongoConnection");
const salesInquiry = require("./data/salesInquiry");
const usersData = require("./data/users");
const projectsData = require("./data/project");

let sales1 = null;
let sales2 = null;
let customer1 = null;
let customer1inquiry = null;

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
		sales1 = await usersData.createUser("Sales", "Account", "sales representative", "sales@gmail.com", "7698654321", "Test@123");
		console.log(sales1);
	} catch (e) {
		console.log(e);
	}

	try {
		sales2 = await usersData.createUser("Salestwo", "Account", "sales representative", "sales2@gmail.com", "7698654321", "Test@123");
		console.log(sales2);
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
		customer1inquiry = await salesInquiry.newInquiry("customer", "Account", "customer@gmail.com", "7698654321", "customer", "I want to install solar system");
	} catch (e) {
		console.log(e);
	}

	try {
		customer1 = await usersData.createUser("customertwo", "Account", "customer", "customer2@gmail.com", "7698654321", "Test@123");
		console.log(customer1);
	} catch (e) {
		console.log(e);
	}

	// try {
	// 	const assignSalesRep = await salesInquiry.assignSalesRep(customer1inquiry._id, sales1._id);
	// } catch (e) {
	// 	console.log(e);
	// }

	try {
		const newProject = await projectsData.createProject("Project-23456", "description", "03/12/2020", "04/10/2021", "ongoing", "approved", "xyz person", "Aplha", "abc", "qwe");
		console.log(newProject);
	} catch (e) {
		console.log(e);
	}

	await connection.closeConnection();
	console.log("Seed Executed");
}

main();

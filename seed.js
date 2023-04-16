const connection = require("./config/mongoConnection");
const salesInquiry = require("./data/salesInquiry");
const usersData = require("./data/users");
const projectsData = require("./data/project");
const inventoryData = require("./data/inventory");
const casual = require("casual");

// generate 50 random inquiries with first name, last name, email, phone, subject and message
casual.define("user", function () {
	return {
		firstName: casual.first_name,
		lastName: casual.last_name,
		email: "",
		phone: casual.numerify("##########"),
		subject: casual.title,
		message: casual.text,
	};
});

let userArray = new Array();
for (let i = 0; i < 20; i++) {
	const user = casual.user;
	user.email = `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@gmail.com`;
	userArray.push(user);
}

let sales1 = null;
let sales2 = null;
let customer1 = null;
let customer1inquiry = null;

async function main() {
	const db = await connection.dbConnection();

	await db.dropDatabase();

	try {
		for (let i = 0; i < userArray.length; i++) {
			const inquiry = await salesInquiry.newInquiry(userArray[i].firstName, userArray[i].lastName, userArray[i].email, userArray[i].phone, userArray[i].subject, userArray[i].message);
			console.log(inquiry);
		}
	} catch (error) {
		console.log(error);
	}

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
		const onsite = await usersData.createUser("Onsite", "Account", "onsite team", "onsite@gmail.com", "7698654321", "Test@123");
		console.log(onsite);
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

const connection = require("./config/mongoConnection");
const salesInquiry = require("./data/salesInquiry");
const usersData = require("./data/users");
const projectsData = require("./data/project");

async function main() {
	const db = await connection.dbConnection();

	await db.dropDatabase();

	// try {
	// 	inquiry1 = await salesInquiry.newInquiry2("Hem Patel", "hempatel1234@gmail.com", "000-000-0000", "Solar Home Rooftop", "I want to install solar system");
	// 	console.log(inquiry1)
	// } catch (e) {
	// 	console.log(e);
	// }

	try {
        inquiry1 = await salesInquiry.newInquiry("Hem", "Patel", "hempatel1234@gmail.com", "9871361803", "Solar Home Rooftop", "I want to install solar system");
        console.log(inquiry1)
    } catch (e) {
        console.log(e);
    }

	try {
        inquiry2 = await salesInquiry.newInquiry("Jay", "Patel", "patelj1799@gmail.com", "9871361803", "Solar System", "I want to install solar system");
        console.log(inquiry2)
    } catch (e) {
        console.log(e);
    }


	// try {
	// 	const newUser = await usersData.createUser("Dave", "Harvey", "sales representative", "daveh@gmail.com", "7865382167", "Test@123");
	// 	console.log(newUser);
	// } catch (error) {
	// 	console.error(error);
	// }

	try {
        user1 = await usersData.createUser("Sales", "Account", "sales representative", "sales@gmail.com", "7698654321", "Sales@123");
        //console.log(user1)
    } catch (e) {
        console.log(e);
    }

	try {
		const newProject = await projectsData.createProject("Project-23456", "description", "03/12/2020", "04/10/2021", "ongoing","approved", "xyz person","Aplha","abc","qwe");
		console.log(newProject);
	} catch (e) {
		console.log(e);
	}

	await connection.closeConnection();
	console.log("Seed Executed");
}

main();
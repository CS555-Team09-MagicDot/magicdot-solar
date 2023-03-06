const connection = require('./config/mongoConnection');
const salesInquiry = require('./data/salesInquiry');

async function main() {
    const db = await connection.dbConnection();

    await db.dropDatabase();

    try {
        inquiry1 = await salesInquiry.newInquiry2("Hem Patel", "hempatel1234@gmail.com", "000-000-0000", "Solar Home Rooftop", "I want to install solar system");
        //console.log(inquiry1)
        } catch (e) {
            console.log(e);
        }


    await connection.closeConnection();
    console.log('Seed Executed');
}

main();
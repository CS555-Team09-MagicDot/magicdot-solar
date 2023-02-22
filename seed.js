const connection = require('./config/mongoConnection');

async function main() {
    const db = await connection.dbConnection();




    await connection.closeConnection();
    console.log('Seed Executed');
}

main();
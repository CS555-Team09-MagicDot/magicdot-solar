const collections = require("../config/mongoCollections");
const users = collections.users;
const usersData = require('./users');
const ObjectId = require("mongodb").ObjectId;

const getCustomerOnGoingProjects =  async (id) => {
    //console.log(id);
    const userInfo = await usersData.getUserById(id);
    console.log(userInfo.ongoingProjects);

}

const getCustomerFinishedProjects =  async (id) => {
    const userInfo = await usersData.getUserById(id);
    console.log(userInfo.finishedProjects);

}

module.exports = {
    getCustomerFinishedProjects,
    getCustomerOnGoingProjects
}
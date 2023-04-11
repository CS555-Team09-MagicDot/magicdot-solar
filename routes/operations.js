const express = require("express");
const router = express.Router();
const inventoryData = require("../data/inventory");
const projectRequestData = require("../data/projectRequest");
const projectData = require("../data/project");

router.route("/").get(async (req, res) => {
  if (!req.session.user || req.session.user.role !== "operational manager") {
    return res.redirect("/");
  }
  try {
    const projectRequestList = await projectRequestData.getAllProjectRequestDetailsList();

    const people = [
      {
        id: 1,
        name: "John Smith",
        address: "123 Main Street, Anytown, USA",
        kwh: "4",
      },
      {
        id: 2,
        name: "Micheal James",
        address: "789 Oak Road, Somewhere, USA",
        kwh: " 5.6",
      },
      {
        id: 3,
        name: "Amber Meadow",
        address: "888 Pine Street, Anyplace, USA",
        kwh: " 3.1",
      },
    ];
    const solarData = [
      {
        id: 1,
        name: "Emily Johnson",
        address: "555 Maple Avenue, Nowhere, USA",
        kWh: "4",
      },
      {
        id: 2,
        name: "Lana Hershey",
        address: "456 Elm Street, Anywhere, USA",
        kWh: " 5.6",
      },
      {
        id: 3,
        name: "Sarah Lee",
        address: " 145 Fake Street, Anytown, USA",
        kWh: " 3.1",
      },
    ];

    return res.status(200).render("operationsDashboard", {
      title: "Operations Dashboard",
      people: people,
      solarData: solarData,
      projectRequestList: projectRequestList
    });
  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

router.route("/inventory").get(async (req, res) => {
  if (!req.session.user || req.session.user.role !== "operational manager") {
    return res.redirect("/");
  }
  try {
    const inventory = await inventoryData.getAllInventoryList();

    return res.status(200).render("inventory", {
      title: "Operations Dashboard - Inventory",
      inventory: inventory, // pass inventory data to the view
    });
  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

router.route("/projectreqdetails/:projectReqId").get(async (req, res) => {
  if (!req.session.user || req.session.user.role !== "operational manager") {
    return res.redirect("/");
  }
  try {
    // console.log(req.params.projectReqId)
    const projectRequestDetails = await projectRequestData.getAllProjectRequestDetails(req.params.projectReqId);

    return res.status(200).render("projectRequestDetails", {
      title: "Project Request Details",
      projectRequestDetails: projectRequestDetails // pass project details data to the view
    });
  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

router.route("/createproject/:projectReqId").get(async (req, res) => {
  if (!req.session.user || req.session.user.role !== "operational manager") {
    return res.redirect("/");
  }
  try {
    
    const projectRequestDetails = await projectRequestData.getAllProjectRequestDetails(req.params.projectReqId);
    // console.log(projectRequestDetails);
    const createProjectInfo = await projectData.createProjectUsingRequest(projectRequestDetails, req.session.user._id);
    // console.log(projectRequestDetails);

    // Chnaging Project Request Status
    const updatedProjectRequest = await projectRequestData.closeProjectRequest(req.params.projectReqId);

    return res.redirect("/operations");

  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

module.exports = router;
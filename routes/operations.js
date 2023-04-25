const express = require("express");
const router = express.Router();
const inventoryData = require("../data/inventory");
const projectRequestData = require("../data/projectRequest");
const projectData = require("../data/project");
const customerData = require("../data/customer");
const usersData = require("../data/users");
const salesInquiryData = require("../data/salesInquiry");

router.route("/").get(async (req, res) => {
  if (!req.session.user || req.session.user.role !== "operational manager") {
    return res.redirect("/");
  }
  try {
    const projectRequestList =
      await projectRequestData.getAllProjectRequestDetailsList();
    // console.log(projectRequestList)

    const ongoingProjectList = await usersData.getUsersOnGoingProjects(
      req.session.user._id
    );
    // console.log(ongoingProjectList);

    return res.status(200).render("operationsDashboard", {
      title: "Operations Dashboard",
      projectRequestList: projectRequestList,
      ongoingProjectList: ongoingProjectList,
    });
  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

router
  .route("/inventory")
  .get(async (req, res) => {
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
  })
  .post(async (req, res) => {
    if (!req.session.user || req.session.user.role !== "operational manager") {
      return res.redirect("/");
    }
    try {
      const id = req.body.id;
      const quantity = req.body.quantity;
      const inventoryRow = await inventoryData.updateInventoryQuantity(
        id,
        quantity
      );
      return res.status(200).json(quantity);
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
    const projectRequestDetails =
      await projectRequestData.getAllProjectRequestDetails(
        req.params.projectReqId
      );

    return res.status(200).render("projectRequestDetails", {
      title: "Project Request Details",
      projectRequestDetails: projectRequestDetails, // pass project details data to the view
    });
  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

router.route("/project/:id").get(async (req, res) => {
  if (!req.session.user || req.session.user.role !== "operational manager") {
    return res.redirect("/");
  }
  try {
    
    const projectDetails = await projectData.getProjectById(req.params.id);
    console.log(projectDetails.status);
    var projectStatus = 0;

    if(projectDetails.status == 'approved'){projectStatus=1}
    else if(projectDetails.status == 'site inspection'){projectStatus=2}
    else if(projectDetails.status == 'inventory check'){projectStatus=3}
    else if(projectDetails.status == 'under construction'){projectStatus=4}
    else if(projectDetails.status == 'final inspection'){projectStatus=5}
    else if(projectDetails.status == 'finished'){projectStatus=6}
    else { throw "Project Status Invalid"}

    console.log(projectStatus);

    return res.status(200).render("projectDetails", {
      title: "Project Details",
      projectDetails: projectDetails,
      projectStatuses: projectStatus,
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
    const projectRequestDetails =
      await projectRequestData.getAllProjectRequestDetails(
        req.params.projectReqId
      );
    // console.log(projectRequestDetails);
    const createProjectInfo = await projectData.createProjectUsingRequest(
      projectRequestDetails,
      req.session.user._id
    );
    // console.log(createProjectInfo);

    // Changing Project Request Status
    const updatedProjectRequest = await projectRequestData.closeProjectRequest(
      req.params.projectReqId
    );
    // Add ProjectId to customer collection
    const updatedCustomer = await usersData.addProjectToUser(
      createProjectInfo._id,
      projectRequestDetails.customerId
    );

    // Add ProjectId to Operational Manager collection
    const updatedOperationalManager = await usersData.addProjectToUser(
      createProjectInfo._id,
      req.session.user._id
    );

    // Add ProjectId to salesInquiry collection
    const updatedsalesInquiry = await salesInquiryData.addProjectToInquiry(
      createProjectInfo._id,
      projectRequestDetails.inquiryId
    );

    return res.redirect("/operations");
  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const inventoryData = require("../data/inventory");
const projectRequestData = require("../data/projectRequest");
const projectData = require("../data/project");
const customerData = require("../data/customer");
const usersData = require("../data/users");

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
    // console.log(req.params.projectReqId)
    // const projectRequestDetails =
    //   await projectRequestData.getAllProjectRequestDetails(
    //     req.params.id
    //   );
    const projectStatus = 3;
    return res.status(200).render("projectDetails", {
      title: "Project Details",
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

    // Chnaging Project Request Status
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

    return res.redirect("/operations");
  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

module.exports = router;

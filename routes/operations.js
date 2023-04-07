const express = require("express");
const router = express.Router();

router.route("/").get(async (req, res) => {
  if (!req.session.user || req.session.user.role !== "operational manager") {
    return res.redirect("/");
  }
  try {
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
    const inventory = [
      {id: 1, name: "Solar Panel", quantity: 892},
      {id: 2, name: "Battery 15 kWh", quantity: 1263},
      {id: 3, name: "Inverter", quantity: 271},
    ];

    return res.status(200).render("inventory", {
      title: "Operations Dashboard - Inventory",
      inventory: inventory, // pass inventory data to the view
    });
  } catch (error) {
    return res.status(400).render("error", {error: error});
  }
});

module.exports = router;

const homepageRoutes = require("./homepage");
const salesRoutes = require("./sales");
const inquiryRoutes = require("./salesInquiry");
const operationsDashboard = require("./operations");
const customerRoutes = require("./customer");
const path = require("path");

const constructorMethod = (app) => {
  app.use("/", homepageRoutes);
  app.use("/", salesRoutes);
  app.use("/inquiry", inquiryRoutes);
  app.use("/operational-dashboard", operationsDashboard);
  app.use("/customer", customerRoutes);
  app.use("/about", (req, res) => {
    res.sendFile(path.resolve("static/about.html"));
  });

  app.use("*", (req, res) => {
    res.status(404).sendFile(path.resolve("static/notfound.html"));
  });
};

module.exports = constructorMethod;

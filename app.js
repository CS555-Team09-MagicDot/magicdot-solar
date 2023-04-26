const express = require("express");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const util = require("util");
const app = express();

const configRoutes = require("./routes");
const exphbars = require("express-handlebars");

var hbs = exphbars.create({});

hbs.handlebars.registerHelper("times", function (n, block) {
  var accum = "";
  for (var i = 0; i < n; ++i) {
    block.data.index = i;
    block.data.first = i === 0;
    block.data.last = i === n - 1;
    accum += block.fn(this);
  }
  return accum;
});

hbs.handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

const static = express.static(__dirname + "/public");
app.use("/public", static);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "Magicdot - Solar",
    secret: "Team09",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(fileUpload());

app.use("*", (req, res, next) => {
  console.log(
    `Log: Method: ${req.method} | URL: ${
      req.originalUrl
    } | Request Body: ${util.inspect(req.body, true, undefined)}`
  );
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("Your routes will be running on http://localhost:3000");
});

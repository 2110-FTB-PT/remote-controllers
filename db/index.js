const client = require("./client");

module.exports = {
  client,
  ...require("./users"),
  ...require("./products"),
  ...require("./reviews"),
  ...require("./orders"),
};

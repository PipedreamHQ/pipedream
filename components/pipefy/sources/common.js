const pipefy = require("../pipefy.app.js");

module.exports = {
  dedupe: "unique",
  props: {
    pipefy,
    db: "$.service.db",
    pipeId: {
      type: "integer",
      label: "Pipe ID",
      description: "ID of the Pipe, found in the URL when viewing the Pipe.",
    },
  },
};
const airtable = require("../airtable.app.js");

module.exports = {
  props: {
    airtable,
    baseId: {
      type: "$.airtable.baseId",
      appProp: "airtable",
    },
    table: {
      type: "$.airtable.table",
      baseIdProp: "baseId",
    },
  },
};

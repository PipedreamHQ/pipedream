import airtable from "../airtable.app.mjs";

export default {
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

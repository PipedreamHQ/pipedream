import airtable from "../airtable.app.mjs";

export default {
  props: {
    airtable,
    baseId: {
      type: "$.airtable.baseId",
      appProp: "airtable",
    },
    // Prop value is either an ID or a stringified table schema object (if `includeSchema: true`)
    table: {
      type: "$.airtable.table",
      baseIdProp: "baseId",
    },
  },
};

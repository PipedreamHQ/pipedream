import airtable from "../../airtable_oauth.app.mjs";

export default {
  props: {
    airtable,
    baseId: {
      propDefinition: [
        airtable,
        "baseId",
      ],
    },
    tableId: {
      propDefinition: [
        airtable,
        "tableId",
      ],
    },
  },
};

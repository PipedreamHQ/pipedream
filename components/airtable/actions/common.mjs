import airtable from "../airtable.app.mjs";

export default {
  props: {
    airtable,
    baseId: {
      propDefinition: [
        airtable,
        "baseId",
      ],
      withLabel: true,
    },
    tableId: {
      propDefinition: [
        airtable,
        "tableId",
        ({ baseId }) => ({
          baseId,
        }),
      ],
      withLabel: true,
    },
  },
};

import airtable from "../../airtable_oauth.app.mjs";

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
          baseId: baseId.value,
        }),
      ],
      withLabel: true,
    },
  },
};

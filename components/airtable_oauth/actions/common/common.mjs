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
    warningAlert: {
      type: "alert",
      alertType: "warning",
      content: "**Note:** if using a custom expression to specify the `Base` (e.g. `{{steps.mydata.$return_value}}`) you should also use a custom expression for the `Table`, and any other props that depend on it.",
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

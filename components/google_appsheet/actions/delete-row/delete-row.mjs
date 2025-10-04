import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_appsheet-delete-row",
  name: "Delete Row",
  description: "Deletes a specific row from a table in the AppSheet app. [See the documentation](https://support.google.com/appsheet/answer/10105399?hl=en&ref_topic=10105767&sjid=1665780.0.1444403316-SA)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    alert: {
      type: "alert",
      alertType: "info",
      content: "The `Row` value may contain field values of the key field values of the record to be deleted.",
    },
    row: {
      propDefinition: [
        common.props.appsheet,
        "row",
      ],
      description: "The `Row` value may contain field values of the key field values of the record to be deleted.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getAction() {
      return "Delete";
    },
    getSummary(response) {
      return `${response.Rows.length} successfully delete!`;
    },
  },
};

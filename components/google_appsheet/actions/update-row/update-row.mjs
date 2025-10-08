import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_appsheet-update-row",
  name: "Update Row",
  description: "Updates an existing row in a specific table in the AppSheet app. [See the documentation](https://support.google.com/appsheet/answer/10105002?hl=en&ref_topic=10105767&sjid=1665780.0.1444403316-SA)",
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
      content: `The \`Row\` value must include the key field values of the record to be updated.
      \nThe \`Row\` value may contain one or more field values of other fields to be updated in the record.
      \nIf a field's name is omitted, that field's value is not changed. If the field can be assigned a string value and the field value you specify is "" then the field's value will be cleared.`,
    },
  },
  methods: {
    ...common.methods,
    getAction() {
      return "Edit";
    },
    getSummary(response) {
      return `${response.Rows.length} successfully updated!`;
    },
  },
};

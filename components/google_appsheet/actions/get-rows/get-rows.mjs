import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_appsheet-get-rows",
  name: "Get Rows",
  description: "Read existing records in a table in the AppSheet app. [See the documentation](https://support.google.com/appsheet/answer/10104797?hl=en&ref_topic=10105767&sjid=1665780.0.1444403316-SA#)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    selector: {
      type: "string",
      label: "Selector",
      description: "You can specify an expression to select and format the rows returned. **Example: Filter(TableName, [Column] = \"Value\")** [See the documentation](https://support.google.com/appsheet/answer/10105770?hl=en&ref_topic=10105767&sjid=3242006823758562345-NC)",
      optional: true,
    },
    row: {
      propDefinition: [
        common.props.appsheet,
        "row",
      ],
      description: "You can also filter the results using the `Row` value. The `Row` value may contain field values of the key field values of the record to be retrieved. **Example:** `{ \"First Name\": \"John\" }`",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getAction() {
      return "Find";
    },
    getData() {
      return this.selector
        ? {
          Properties: {
            Selector: this.selector,
          },
        }
        : {};
    },
    getSummary(response) {
      return `Successfully retrieved ${ response.length || 0} rows`;
    },
  },
};

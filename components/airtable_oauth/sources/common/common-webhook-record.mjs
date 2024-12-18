import airtable from "../../airtable_oauth.app.mjs";
import common from "./common-webhook.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getDataTypes() {
      return ["tableData"];
    },
  },
  props: {
    ...common.props,
    watchDataInFieldIds: {
      propDefinition: [
        airtable,
        "sortFieldId",
        (c) => ({
          baseId: c.baseId,
          tableId: c.tableId,
        }),
      ],
      type: "string[]",
      label: "Watch Data In Field Ids",
      description:
        "Only emit events for updates that modify values in cells in these fields. If omitted, all fields within the table/view/base are watched",
    },
    includeCellValuesInFieldIds: {
      propDefinition: [
        airtable,
        "sortFieldId",
        (c) => ({
          baseId: c.baseId,
          tableId: c.tableId,
        }),
      ],
      type: "string[]",
      label: "Include Cell Values in Field Ids",
      description: "Fields to include in the event payload, regardless of whether or not they changed",
    },
    includePreviousCellValues: {
      type: "boolean",
      label: "Include Previous Cell Values",
      description:
        "If true, include the previous cell value in the event payload",
      optional: true,
    },
  },
};

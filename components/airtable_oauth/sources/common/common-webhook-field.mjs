import airtable from "../../airtable_oauth.app.mjs";
import common from "./common-webhook.mjs";

export default {
  ...common,
  getDataTypes() {
    return [
      "tableFields",
    ];
  },
  props: {
    ...common.props,
    watchSchemasOfFieldIds: {
      propDefinition: [
        airtable,
        "sortFieldId",
        (c) => ({
          baseId: c.baseId,
          tableId: c.tableId,
        }),
      ],
      type: "string[]",
      label: "Watch Schemas of Field Ids",
      description:
        "Only emit events for updates that modify the schemas of these fields. If omitted, schemas of all fields within the table/view/base are watched",
    },
    includePreviousFieldDefinitions: {
      type: "boolean",
      label: "Include Previous Field Definitions",
      description:
        "If true, include the previous field definition in the event payload",
      optional: true,
    },
  },
};

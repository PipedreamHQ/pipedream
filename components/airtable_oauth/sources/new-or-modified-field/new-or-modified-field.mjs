import common from "../common/common-webhook-field.mjs";
import airtable from "../../airtable_oauth.app.mjs";

export default {
  ...common,
  name: "New or Modified Field (Instant)",
  description: "Emit new event when a field is created or updated in the selected table",
  key: "airtable_oauth-new-or-modified-field",
  version: "1.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getChangeTypes() {
      return [
        "add",
        "update",
      ];
    },
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
      label: "Field Schemas to Watch",
      description:
        "Only emit events for updates that modify the schemas of these fields. If omitted, schemas of all fields within the table/view/base are watched",
    },
  },
};

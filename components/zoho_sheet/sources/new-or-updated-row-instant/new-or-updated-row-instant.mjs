import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_sheet-new-or-updated-row-instant",
  name: "New or Updated Row (Instant)",
  description: "Emit new event whenever a row is added or modified.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    workbookId: {
      propDefinition: [
        common.props.zohoSheet,
        "workbookId",
      ],
    },
    worksheetId: {
      propDefinition: [
        common.props.zohoSheet,
        "worksheet",
        ({ workbookId }) => ({
          workbookId,
        }),
      ],
      withLabel: true,
    },
    alert: {
      type: "alert",
      alertType: "info",
      content: "**New row** will be triggered only after the entire row is completed.",
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "update_worksheet";
    },
    getExtraData() {
      return {
        resource_id: this.workbookId,
        worksheet_id: this.worksheetId.value,
      };
    },
    getSummary({ updated_rows }) {
      return  `Row ${updated_rows[0].row_type === "NEW"
        ? "created"
        : "updated"} in worksheet ${this.worksheetId.label}`;
    },
  },
  sampleEmit,
};

import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_sheet-new-row-instant",
  name: "New Row Created (Instant)",
  description: "Emit new event each time a new row is created in a Zoho Sheet worksheet.",
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
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "new_row";
    },
    getExtraData() {
      return {
        resource_id: this.workbookId,
        worksheet_id: this.worksheetId.value,
      };
    },
    getSummary() {
      return  `New row in worksheet ${this.worksheetId.label}`;
    },
  },
  sampleEmit,
};

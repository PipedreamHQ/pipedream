import storeganise from "../../storeganise.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "storeganise-add-invoice-note",
  name: "Add Invoice Note",
  description: "Adds a note to the selected invoice. Requires both invoice id and the note content as props. Option to set a timestamp to the note is available.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    storeganise,
    invoiceId: {
      propDefinition: [
        storeganise,
        "invoiceId",
      ],
    },
    noteContent: {
      propDefinition: [
        storeganise,
        "noteContent",
      ],
    },
    timestamp: {
      propDefinition: [
        storeganise,
        "timestamp",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.storeganise.addNoteToInvoice(this.invoiceId, this.noteContent, this.timestamp);
    $.export("$summary", `Successfully added note to invoice ${this.invoiceId}`);
    return response;
  },
};

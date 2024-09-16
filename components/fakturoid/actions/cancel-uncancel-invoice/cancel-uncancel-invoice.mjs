import fakturoid from "../../fakturoid.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fakturoid-cancel-uncancel-invoice",
  name: "Cancel or Uncancel Invoice",
  description: "Cancels an existing invoice or revokes previous cancellation. [See the documentation](https://www.fakturoid.cz/api/v3)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fakturoid,
    invoiceId: {
      propDefinition: [
        fakturoid,
        "invoiceId",
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "The action to perform on the invoice (cancel or uncancel)",
      options: [
        {
          label: "Cancel",
          value: "cancel",
        },
        {
          label: "Uncancel",
          value: "undo_cancel",
        },
      ],
    },
  },
  async run({ $ }) {
    const {
      invoiceId, action,
    } = this;
    const method = action === "cancel"
      ? "cancelInvoice"
      : "undoCancelInvoice";
    const response = await this.fakturoid[method]({
      invoiceId,
    });

    $.export("$summary", `${action === "cancel"
      ? "Cancelled"
      : "Uncancelled"} invoice with ID ${invoiceId}`);
    return response;
  },
};

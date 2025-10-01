import constants from "../../common/constants.mjs";
import fakturoid from "../../fakturoid.app.mjs";

export default {
  key: "fakturoid-cancel-uncancel-invoice",
  name: "Cancel or Uncancel Invoice",
  description: "Cancels an existing invoice or revokes previous cancellation. [See the documentation](https://www.fakturoid.cz/api/v3)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fakturoid,
    accountSlug: {
      propDefinition: [
        fakturoid,
        "accountSlug",
      ],
    },
    invoiceId: {
      propDefinition: [
        fakturoid,
        "invoiceId",
        ({ accountSlug }) => ({
          accountSlug,
        }),
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "The action to perform on the invoice (cancel or uncancel)",
      options: constants.ACTION_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.fakturoid.fireInvoice({
      $,
      accountSlug: this.accountSlug,
      invoiceId: this.invoiceId,
      params: {
        event: this.action,
      },
    });

    $.export("$summary", `${this.action === "cancel"
      ? "Cancelled"
      : "Uncancelled"} invoice with ID ${this.invoiceId}`);
    return response;
  },
};

import fakturoid from "../../fakturoid.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fakturoid-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice. [See the documentation](https://www.fakturoid.cz/api/v3/invoices)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fakturoid,
    contactId: {
      propDefinition: [
        fakturoid,
        "contactId",
      ],
    },
    lines: {
      propDefinition: [
        fakturoid,
        "lines",
      ],
    },
    number: {
      propDefinition: [
        fakturoid,
        "number",
      ],
      optional: true,
    },
    due: {
      propDefinition: [
        fakturoid,
        "due",
      ],
      optional: true,
    },
    note: {
      propDefinition: [
        fakturoid,
        "note",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fakturoid.createInvoice({
      contactId: this.contactId,
      lines: this.lines.map(JSON.parse),
      number: this.number,
      due: this.due,
      note: this.note,
    });

    $.export("$summary", `Successfully created invoice with ID ${response.id}`);
    return response;
  },
};

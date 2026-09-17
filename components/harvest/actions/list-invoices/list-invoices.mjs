import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-list-invoices",
  name: "List Invoices",
  description: `List invoices with optional filters, automatically following pagination up to ${constants.MAX_AUTO_PAGINATE_RECORDS} invoices. Use this to discover invoice IDs for **Get Invoice**, **Update Invoice**, or **Delete Invoice**. Example: call with clientId set to InGen Corp's client ID and state="open" to find their unpaid invoices. [See the documentation](https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/#list-all-invoices).`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    clientId: {
      propDefinition: [
        harvest,
        "clientId",
      ],
    },
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
      optional: true,
    },
    updatedSince: {
      propDefinition: [
        harvest,
        "updatedSince",
      ],
    },
    from: {
      type: "string",
      label: "From",
      description: "Only return invoices with an issue_date on or after this date, `YYYY-MM-DD`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Only return invoices with an issue_date on or before this date, `YYYY-MM-DD`.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Filter by state. One of: `draft`, `open`, `paid`, `closed`.",
      optional: true,
      options: constants.INVOICE_STATE_OPTIONS,
    },
  },
  async run({ $ }) {
    const invoices = [];
    const pages = this.harvest.listInvoicesPaginated({
      page: 1,
      accountId: this.accountId,
      client_id: this.clientId,
      project_id: this.projectId,
      updated_since: this.updatedSince,
      from: this.from,
      to: this.to,
      state: this.state,
    });
    for await (const invoice of pages) {
      invoices.push(invoice);
      if (invoices.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
    }
    const count = invoices.length;
    $.export("$summary", `Successfully retrieved ${count} invoice${count === 1
      ? ""
      : "s"}`);
    return invoices;
  },
};

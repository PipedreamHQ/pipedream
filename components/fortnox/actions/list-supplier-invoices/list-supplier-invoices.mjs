import app from "../../fortnox.app.mjs";

export default {
  key: "fortnox-list-supplier-invoices",
  name: "List Supplier Invoices",
  description: "List all invoices for a supplier. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_SupplierInvoices/operation/list_39)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter the invoices by supplier number",
      options: [
        {
          label: "Retrieves all invoices with the status `cancelled`",
          value: "cancelled",
        },
        {
          label: "Retrieves all invoices that has been fully paid",
          value: "fullpaid",
        },
        {
          label: "Retrieves all invoices that is unpaid",
          value: "unpaid",
        },
        {
          label: "Retrieves all invoices that is unpaid and overdue",
          value: "unpaidoverdue",
        },
        {
          label: "Retrieves all invoices that is unbooked",
          value: "unbooked",
        },
        {
          label: "Retrieves all invoices that has PaymentPending=true and is booked",
          value: "pendingpayment",
        },
        {
          label: "Retrieves all invoices that has a waiting authorization pending",
          value: "authorizepending",
        },
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { SupplierInvoices } = await this.app.listSupplierInvoices({
      $,
    });

    $.export("$summary", `Successfully retrieved ${SupplierInvoices.length} supplier invoice${SupplierInvoices.length === 1
      ? ""
      : "s"}`);
    return SupplierInvoices;
  },
};

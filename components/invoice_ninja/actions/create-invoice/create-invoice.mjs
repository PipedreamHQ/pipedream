import { parseObject } from "../../common/utils.mjs";
import app from "../../invoice_ninja.app.mjs";

export default {
  key: "invoice_ninja-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice. [See the documentation](https://api-docs.invoicing.co/#tag/invoices/POST/api/v1/invoices).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      optional: true,
    },
    assignedUserId: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "Assigned User ID",
      description: "The ID of the user to assign the invoice to",
      optional: true,
    },
    number: {
      type: "string",
      label: "Invoice Number",
      description: "The number of the invoice",
      optional: true,
    },
    poNumber: {
      type: "string",
      label: "PO Number",
      description: "Purchase Order number for the invoice",
      optional: true,
    },
    terms: {
      type: "string",
      label: "Terms",
      description: "Payment terms for the invoice",
      optional: true,
    },
    publicNotes: {
      type: "string",
      label: "Public Notes",
      description: "Public notes for the invoice",
      optional: true,
    },
    privateNotes: {
      type: "string",
      label: "Private Notes",
      description: "Private notes for the invoice",
      optional: true,
    },
    footer: {
      type: "string",
      label: "Footer",
      description: "Footer content for the invoice",
      optional: true,
    },
    customValue1: {
      type: "string",
      label: "Custom Value 1",
      description: "Custom field 1 for the invoice",
      optional: true,
    },
    customValue2: {
      type: "string",
      label: "Custom Value 2",
      description: "Custom field 2 for the invoice",
      optional: true,
    },
    customValue3: {
      type: "string",
      label: "Custom Value 3",
      description: "Custom field 3 for the invoice",
      optional: true,
    },
    customValue4: {
      type: "string",
      label: "Custom Value 4",
      description: "Custom field 4 for the invoice",
      optional: true,
    },
    totalTaxes: {
      type: "string",
      label: "Total Taxes",
      description: "Total taxes for the invoice",
      optional: true,
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "An array of line items in JSON format. **Example: { \"quantity\": 1, \"cost\": 10, \"product_key\": \"Product key\", \"product_cost\": 10, \"notes\": \"Item notes\", \"discount\": 5, \"is_amount_discount\": false, \"tax_name1\": \"GST\", \"tax_rate1\": 10, \"tax_name2\": \"VAT\", \"tax_rate2\": 5, \"tax_name3\": \"CA Sales Tax\", \"tax_rate3\": 3, \"sort_id\": \"0\", \"date\": \"2023-03-19T00:00:00Z\", \"custom_value1\": \"Custom value 1\", \"custom_value2\": \"Custom value 2\", \"custom_value3\": \"Custom value 3\", \"custom_value4\": \"Custom value 4\", \"type_id\": \"1\", \"tax_id\": \"1\" }.**",
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Total amount of the invoice",
      optional: true,
    },
    balance: {
      type: "string",
      label: "Balance",
      description: "Balance remaining on the invoice",
      optional: true,
    },
    paidToDate: {
      type: "string",
      label: "Paid To Date",
      description: "Amount paid to date for the invoice",
      optional: true,
    },
    discount: {
      type: "string",
      label: "Discount",
      description: "Discount applied to the invoice",
      optional: true,
    },
    date: {
      type: "string",
      label: "Invoice Date",
      description: "Date of the invoice (YYYY-MM-DD)",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date for the invoice (YYYY-MM-DD)",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.app.createNewInvoice({
      $,
      data: {
        client_id: this.clientId,
        user_id: this.userId,
        assigned_user_id: this.assignedUserId,
        status_id: this.statusId,
        number: this.number,
        po_number: this.poNumber,
        terms: this.terms,
        public_notes: this.publicNotes,
        private_notes: this.privateNotes,
        footer: this.footer,
        custom_value1: this.customValue1,
        custom_value2: this.customValue2,
        custom_value3: this.customValue3,
        custom_value4: this.customValue4,
        total_taxes: this.totalTaxes && parseFloat(this.totalTaxes),
        line_items: parseObject(this.lineItems),
        amount: this.amount && parseFloat(this.amount),
        balance: this.balance && parseFloat(this.balance),
        paid_to_date: this.paidToDate && parseFloat(this.paidToDate),
        discount: this.discount && parseFloat(this.discount),
        date: this.date,
        due_date: this.dueDate,
      },
    });
    $.export("$summary", `Created invoice with ID: ${data.id}`);
    return data;
  },
};

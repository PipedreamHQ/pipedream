import { parseObject } from "../../common/utils.mjs";
import invoiced from "../../invoiced.app.mjs";

export default {
  key: "invoiced-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Invoiced. [See the documentation](https://developer.invoiced.com/api/invoices#create-an-invoice)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    invoiced,
    customer: {
      propDefinition: [
        invoiced,
        "customerId",
      ],
      description: "The ID of the customer this invoice is for",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Invoice name for internal use, defaults to \"Invoice\"",
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "The reference number assigned to the invoice, defaults to next # in auto-numbering sequence",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "[3-letter ISO code](https://en.wikipedia.org/wiki/ISO_4217) - defaults to account currency",
      optional: true,
    },
    autoplay: {
      type: "boolean",
      label: "Autoplay",
      description: "AutoPay enabled? - inherited from customer by default",
      optional: true,
    },
    paymentTerms: {
      type: "string",
      label: "Payment Terms",
      description: "Payment terms for the invoice, i.e. \"NET 30\" - inherited from customer by default",
      optional: true,
    },
    purchaseOrder: {
      type: "string",
      label: "Purchase Order",
      description: "The customer's purchase order number",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Invoice date - defaults to current timestamp. Format YYYY-MM-DDTHH:MM:SSZ.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date - computed from `paymentTerms` when not supplied. Format YYYY-MM-DDTHH:MM:SSZ.",
      optional: true,
    },
    draft: {
      type: "boolean",
      label: "Draft",
      description: "When false, the invoice is considered outstanding, or when true, the invoice is a draft",
      optional: true,
    },
    closed: {
      type: "boolean",
      label: "Closed",
      description: "Marks an invoice as closed",
      optional: true,
    },
    items: {
      type: "string[]",
      label: "Items",
      description: "JSON array of invoice items. Example: [{ \"amount\": 45, \"catalog_item\": null, \"description\": null, \"discountable\": true, \"discounts\": [], \"id\": 7, \"metadata\": [], \"name\": \"Copy Paper, Case\", \"object\": \"line_item\", \"quantity\": 1, \"taxable\": true, \"taxes\": [], \"type\": \"product\", \"unit_cost\": 45 }]",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes displayed on invoice",
      optional: true,
    },
    discounts: {
      propDefinition: [
        invoiced,
        "couponId",
      ],
      type: "string[]",
      label: "Discounts",
      description: "A list of coupon Ids",
      optional: true,
    },
    taxes: {
      propDefinition: [
        invoiced,
        "taxId",
      ],
      type: "string[]",
      label: "Taxes",
      description: "Array of Tax Rate IDs",
      optional: true,
    },
    metadata: {
      propDefinition: [
        invoiced,
        "metadata",
      ],
    },
    disabledPaymentMethods: {
      propDefinition: [
        invoiced,
        "paymentMethodId",
      ],
    },
    calculateTaxes: {
      type: "boolean",
      label: "Calculate Taxes",
      description: "Disables tax calculation, default is true",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.invoiced.createInvoice({
      $,
      data: {
        customer: this.customer,
        name: this.name,
        number: this.number,
        currency: this.currency,
        autoplay: this.autoplay,
        payment_terms: this.paymentTerms,
        purchase_order: this.purchaseOrder,
        date: this.date && Date.parse(this.date),
        due_date: this.dueDate && Date.parse(this.dueDate),
        draft: this.draft,
        closed: this.closed,
        items: this.items,
        notes: this.notes,
        discounts: parseObject(this.discounts),
        taxes: parseObject(this.taxes),
        metadata: this.metadata,
        disabled_payment_methods: parseObject(this.disabledPaymentMethods),
        calculate_taxes: this.calculateTaxes,
      },
    });

    $.export("$summary", `Successfully created invoice with ID ${response.id} for customer ${response.customer}`);

    return response;
  },
};


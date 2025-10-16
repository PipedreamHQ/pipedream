import app from "../../agiled.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "agiled-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Agiled. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    invoiceNumber: {
      type: "integer",
      label: "Invoice Number",
      description: "Invoice Number in integer form. Don't include prefix. It must be `10` for example and never `INV#10`",
    },
    clientId: {
      label: "Client ID",
      description: "The ID of a client.",
      propDefinition: [
        app,
        "userId",
      ],
    },
    issueDate: {
      type: "string",
      label: "Issue Date",
      description: "Issue Date (Use same date format as in your company settings). Eg. `2021-01-01`",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due Date (Use same date format as in your company settings). Eg. `2021-01-01`",
    },
    currencyId: {
      propDefinition: [
        app,
        "currencyId",
      ],
    },
    recurringPayment: {
      type: "boolean",
      label: "Recurring Payment",
      description: "If its a recurring profile or not",
    },
    discountType: {
      type: "string",
      label: "Discount Type",
      description: "Discount Type",
      options: [
        "percent",
        "fixed",
      ],
    },
    discount: {
      type: "integer",
      label: "Discount",
      description: "Discount. Eg. `10`",
      default: 0,
    },
    subTotal: {
      type: "integer",
      label: "Sub Total",
      description: "Sub Total. Eg. `100`",
    },
    total: {
      type: "integer",
      label: "Total",
      description: "Total. Eg. `120`",
    },
    billingFrequency: {
      type: "string",
      label: "Billing Frequency",
      description: "Specifies billing frequency. Either `day`, `week`, `month` or `year`.",
      options: [
        "day",
        "week",
        "month",
        "year",
      ],
    },
    billingInterval: {
      type: "integer",
      label: "Billing Interval",
      description: "The number of intervals between subscription billings.",
    },
    billingCycle: {
      type: "string",
      label: "Billing Cycle",
      description: "How many times you want to bill? Eg. `1`",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Notes in Invoice",
      optional: true,
    },
    numberOfItems: {
      type: "integer",
      label: "Number Of Items",
      description: "The number of items to generate. Defaults to 1.",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    boolToString(value) {
      return value
        ? "yes"
        : "no";
    },
    createInvoice(args = {}) {
      return this.app.post({
        path: "/invoices",
        ...args,
      });
    },
    itemsPropsMapper(prefix) {
      const {
        [`${prefix}name`]: name,
        [`${prefix}summary`]: summary,
        [`${prefix}quantity`]: quantity,
        [`${prefix}unitPrice`]: unitPrice,
        [`${prefix}amount`]: amount,
      } = this;

      return {
        item_name: name,
        item_summary: summary,
        item_type: "item",
        quantity,
        unit_price: unitPrice,
        amount,
      };
    },
    getItemsPropDefinitions({
      prefix, label,
    } = {}) {
      return {
        [`${prefix}name`]: {
          type: "string",
          label: `${label} - Name`,
          description: "Name of the item",
        },
        [`${prefix}summary`]: {
          type: "string",
          label: `${label} - Summary`,
          description: "Summary of the item",
        },
        [`${prefix}quantity`]: {
          type: "integer",
          label: `${label} - Quantity`,
          description: "Quantity of the item. Eg. `1`",
        },
        [`${prefix}unitPrice`]: {
          type: "integer",
          label: `${label} - Unit Price`,
          description: "Unit Price of the item. Eg. `10`",
        },
        [`${prefix}amount`]: {
          type: "integer",
          label: `${label} - Amount`,
          description: "Amount of the item. **Unit Price** x **Quantity**",
        },
      };
    },
  },
  async additionalProps() {
    const {
      numberOfItems,
      getItemsPropDefinitions,
    } = this;

    return utils.getAdditionalProps({
      numberOfFields: numberOfItems,
      fieldName: "item",
      getPropDefinitions: getItemsPropDefinitions,
    });
  },
  async run({ $ }) {
    const {
      boolToString,
      numberOfItems,
      itemsPropsMapper,
      createInvoice,
      invoiceNumber,
      clientId,
      issueDate,
      dueDate,
      discountType,
      discount,
      currencyId,
      recurringPayment,
      note,
      total,
      subTotal,
      billingFrequency,
      billingInterval,
      billingCycle,
    } = this;

    const response = await createInvoice({
      $,
      data: {
        invoice_number: invoiceNumber,
        client_id: clientId,
        issue_date: issueDate,
        due_date: dueDate,
        discount_type: discountType,
        discount,
        currency_id: currencyId,
        recurring_payment: boolToString(recurringPayment),
        billing_frequency: billingFrequency,
        billing_interval: billingInterval,
        billing_cycle: billingCycle,
        note,
        total,
        sub_total: subTotal,
        items: utils.getFieldsProps({
          numberOfFields: numberOfItems,
          fieldName: "item",
          propsMapper: itemsPropsMapper,
        }),
      },
    });

    $.export("$summary", `Successfully created invoice with ID \`${response.data.id}\``);

    return response;
  },
};

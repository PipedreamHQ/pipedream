import loyverse from "../../loyverse.app.mjs";
import { parseAsJSON } from "../../common/utils.mjs";

export default {
  key: "loyverse-create-receipt",
  name: "Create Receipt",
  description: "Creates a new receipt for a specific store. [See the documentation](https://developer.loyverse.com/docs/#tag/Receipts/paths/~1receipts/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    loyverse,
    storeId: {
      propDefinition: [
        loyverse,
        "storeId",
      ],
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "[An array of JSON-stringified objects](https://developer.loyverse.com/docs/#tag/Receipts/paths/~1receipts/post). You can use the **Generate Receipt Items** action to generate these items.",
    },
    paymentTypeId: {
      propDefinition: [
        loyverse,
        "paymentTypeId",
      ],
    },
    employeeId: {
      propDefinition: [
        loyverse,
        "employeeId",
      ],
    },
    order: {
      type: "string",
      label: "Order",
      description: "The order name or number associated with the receipt",
      optional: true,
    },
    customerId: {
      propDefinition: [
        loyverse,
        "customerId",
      ],
      description: "Select a customer or provide a customer ID.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The name of the source this receipt comes from. By default it is the name of the application that created the receipt.",
      optional: true,
    },
    receiptDate: {
      type: "string",
      label: "Receipt Date",
      description: "A date/time string such as `2022-03-15T18:30:00Z`. By default, this is the date/time the receipt was created.",
      optional: true,
    },
    totalDiscounts: {
      type: "string[]",
      label: "Total Discounts",
      description: "The list of all discounts applied in the receipt, as JSON-stringified objects. [See the documentation](https://developer.loyverse.com/docs/#tag/Receipts/paths/~1receipts/post) for the expected properties.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "The receipt's note",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      lineItems, totalDiscounts,
    } = this;
    const discounts = totalDiscounts?.map?.(parseAsJSON);
    const response = await this.loyverse.createReceipt({
      $,
      data: {
        store_id: this.storeId,
        line_items: lineItems.map?.(parseAsJSON) ?? JSON.parse(lineItems),
        payments: [
          {
            payment_type_id: this.paymentTypeId,
          },
        ],
        employee_id: this.employeeId,
        order: this.order,
        customer_id: this.customerId,
        source: this.source,
        receipt_date: this.receiptDate,
        total_discounts: discounts ?? (totalDiscounts && JSON.parse(totalDiscounts)),
        note: this.note,
      },
    });
    $.export("$summary", `Successfully created receipt with number ${response.receipt_number}`);
    return response;
  },
};

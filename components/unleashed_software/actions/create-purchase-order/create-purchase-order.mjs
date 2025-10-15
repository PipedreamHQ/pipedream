import unleashedSoftware from "../../unleashed_software.app.mjs";

export default {
  key: "unleashed_software-create-purchase-order",
  name: "Create Purchase Order",
  description: "Create a purchase order. [See the documentation](https://apidocs.unleashedsoftware.com/Purchases)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    unleashedSoftware,
    orderStatus: {
      propDefinition: [
        unleashedSoftware,
        "purchaseOrderStatus",
      ],
    },
    supplierId: {
      propDefinition: [
        unleashedSoftware,
        "supplierId",
      ],
    },
    taxCode: {
      propDefinition: [
        unleashedSoftware,
        "taxCode",
      ],
    },
    warehouseId: {
      propDefinition: [
        unleashedSoftware,
        "warehouseId",
      ],
      optional: true,
    },
    exchangeRate: {
      propDefinition: [
        unleashedSoftware,
        "exchangeRate",
      ],
      optional: true,
    },
    comments: {
      propDefinition: [
        unleashedSoftware,
        "comments",
      ],
    },
    numLineItems: {
      type: "integer",
      label: "Number of Line Items",
      description: "The number of line items to enter",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.numLineItems) {
      return props;
    }
    for (let i = 1; i <= this.numLineItems; i++) {
      props[`line_${i}_productId`] = {
        type: "string",
        label: `Line Item ${i} - Product ID`,
        options: async ({ page }) => {
          const { Items: products } = await this.unleashedSoftware.listProducts({
            page: page + 1,
          });
          return products?.map(({
            Guid: value, ProductDescription: label,
          }) => ({
            value,
            label,
          })) || [];
        },
      };
      props[`line_${i}_quantity`] = {
        type: "string",
        label: `Line Item ${i} - Quantity`,
      };
      props[`line_${i}_unitPrice`] = {
        type: "string",
        label: `Line Item ${i} - Unit Price`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const lineItems = [];
    let subtotal = 0, taxTotal = 0;
    const taxRate = await this.unleashedSoftware.getTaxRateFromCode({
      $,
      taxCode: this.taxCode,
    });

    for (let i = 1; i <= this.numLineItems; i++) {
      const lineTotal = +this[`line_${i}_unitPrice`] * +this[`line_${i}_quantity`];
      const lineTax = lineTotal * (taxRate / 100);
      lineItems.push({
        Product: {
          Guid: this[`line_${i}_productId`],
        },
        OrderQuantity: +this[`line_${i}_quantity`],
        UnitPrice: +this[`line_${i}_unitPrice`],
        LineTotal: lineTotal,
        LineTax: lineTax,
        LineNumber: i,
      });
      subtotal += lineTotal;
      taxTotal += lineTax;
    }
    const response = await this.unleashedSoftware.createPurchaseOrder({
      $,
      data: {
        Supplier: {
          Guid: this.supplierId,
        },
        ExchangeRate: +this.exchangeRate,
        OrderStatus: this.orderStatus,
        Warehouse: {
          Guid: this.warehouseId,
        },
        Comments: this.comments,
        Subtotal: subtotal,
        Tax: {
          TaxCode: this.taxCode,
        },
        TaxRate: taxRate,
        TaxTotal: taxTotal,
        Total: subtotal + taxTotal,
        PurchaseOrderLines: lineItems,
      },
    });

    $.export("$summary", "Successfully created purchase order");
    return response;
  },
};

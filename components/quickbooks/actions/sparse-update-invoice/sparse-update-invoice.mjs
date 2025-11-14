import { parseLineItems } from "../../common/utils.mjs";
import quickbooks from "../../quickbooks.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "quickbooks-sparse-update-invoice",
  name: "Sparse Update Invoice",
  description: "Sparse updating provides the ability to update a subset of properties for a given object; only elements specified in the request are updated. Missing elements are left untouched. The ID of the object to update is specified in the request body.​ [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#sparse-update-an-invoice)",
  version: "0.1.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    invoiceId: {
      propDefinition: [
        quickbooks,
        "invoiceId",
      ],
    },
    customer: {
      propDefinition: [
        quickbooks,
        "customer",
      ],
    },
    currency: {
      propDefinition: [
        quickbooks,
        "currency",
      ],
    },
    lineItemsAsObjects: {
      propDefinition: [
        quickbooks,
        "lineItemsAsObjects",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.lineItemsAsObjects) {
      props.lineItems = {
        type: "string[]",
        label: "Line Items",
        description: "Line items of an invoice. Set DetailType to `SalesItemLineDetail`, `GroupLineDetail`, `DescriptionOnly`, `DiscountLineDetail`, or `SubTotalLineDetail`. Example: `{ \"DetailType\": \"SalesItemLineDetail\", \"Amount\": 100.0, \"SalesItemLineDetail\": { \"ItemRef\": { \"name\": \"Services\", \"value\": \"1\" } } }`",
      };
      return props;
    }
    props.numLineItems = {
      type: "integer",
      label: "Number of Line Items",
      description: "The number of line items to enter",
      reloadProps: true,
    };
    if (!this.numLineItems) {
      return props;
    }
    for (let i = 1; i <= this.numLineItems; i++) {
      props[`item_${i}`] = {
        type: "string",
        label: `Line ${i} - Item ID`,
        options: async ({ page }) => {
          return this.quickbooks.getPropOptions({
            page,
            resource: "Item",
            mapper: ({
              Id: value, Name: label,
            }) => ({
              value,
              label,
            }),
          });
        },
      };
      props[`amount_${i}`] = {
        type: "string",
        label: `Line ${i} - Amount`,
      };
    }
    return props;
  },
  methods: {
    buildLineItems() {
      const lineItems = [];
      for (let i = 1; i <= this.numLineItems; i++) {
        lineItems.push({
          DetailType: "SalesItemLineDetail",
          Amount: this[`amount_${i}`],
          SalesItemLineDetail: {
            ItemRef: {
              value: this[`item_${i}`],
            },
          },
        });
      }
      return lineItems;
    },
  },
  async run({ $ }) {
    const lines = this.lineItemsAsObjects
      ? parseLineItems(this.lineItems)
      : this.buildLineItems();

    lines.forEach((line) => {
      if (line.DetailType !== "SalesItemLineDetail" && line.DetailType !== "GroupLineDetail" && line.DetailType !== "DescriptionOnly" && line.DetailType !== "DiscountLineDetail" && line.DetailType !== "SubTotalLineDetail") {
        throw new ConfigurationError("Line Item DetailType must be `SalesItemLineDetail`, `GroupLineDetail`, `DescriptionOnly`, `DiscountLineDetail`, or `SubTotalLineDetail`");
      }
    });

    const { Invoice: invoice } = await this.quickbooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });

    if (lines?.length) invoice.Line?.push(...lines);

    const response = await this.quickbooks.sparseUpdateInvoice({
      $,
      data: {
        sparse: true,
        Id: this.invoiceId,
        SyncToken: invoice.SyncToken,
        CurrencyRef: this.currencyRefValue && {
          value: this.currencyRefValue,
        },
        CustomerRef: {
          value: this.customer,
        },
        Line: invoice.Line,
      },
    });

    if (response) {
      $.export("summary", `Successfully updated invoice with ID ${response.Invoice.Id}`);
    }

    return response;
  },
};

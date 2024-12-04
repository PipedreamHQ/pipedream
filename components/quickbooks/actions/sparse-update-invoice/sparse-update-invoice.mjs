import { ConfigurationError } from "@pipedream/platform";
import { parseOne } from "../../common/utils.mjs";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-sparse-update-invoice",
  name: "Sparse Update Invoice",
  description: "Sparse updating provides the ability to update a subset of properties for a given object; only elements specified in the request are updated. Missing elements are left untouched. The ID of the object to update is specified in the request body.​ [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#sparse-update-an-invoice)",
  version: "0.1.5",
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
        description: "Line items of an invoice. Example: `{ \"DetailType\": \"SalesItemLineDetail\", \"Amount\": 100.0, \"SalesItemLineDetail\": { \"ItemRef\": { \"name\": \"Services\", \"value\": \"1\" } } }`",
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
    if (this.lineItemsAsObjects) {
      try {
        this.lineItems = this.lineItems.map((lineItem) => typeof lineItem === "string"
          ? JSON.parse(lineItem)
          : lineItem);
      } catch (error) {
        throw new ConfigurationError(`We got an error trying to parse the LineItems. Error: ${error}`);
      }
    }

    const { Invoice } = await this.quickbooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });

    if (this.lineItems.length) Invoice.Line?.push(...this.lineItems);

    Invoice.CurrencyRef = parseOne(this.currency);
    Invoice.CustomerRef = parseOne(this.customer);

    const response = await this.quickbooks.sparseUpdateInvoice({
      $,
      data: Invoice,
    });

    if (response) {
      $.export("summary", `Successfully updated invoice with Id ${response.Invoice.Id}`);
    }

    return response;
  },
};

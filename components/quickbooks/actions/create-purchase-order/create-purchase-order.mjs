import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";
import {
  parseLineItems,
  buildPurchaseLineItems,
} from "../../common/utils.mjs";

export default {
  key: "quickbooks-create-purchase-order",
  name: "Create Purchase Order",
  description: "Creates a purchase order. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchaseorder#create-a-purchaseorder)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account to use for the purchase order",
      async options() {
        const { QueryResponse: queryResponse } = await this.quickbooks.query({
          params: {
            query: "select * from Account where Classification = 'Liability' AND AccountSubType = 'AccountsPayable'",
          },
        });
        return queryResponse.Account.map(({
          Id, Name,
        }) => ({
          value: Id,
          label: Name,
        }));
      },
    },
    vendorRefValue: {
      propDefinition: [
        quickbooks,
        "vendor",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Date when the purchase order is due (YYYY-MM-DD)",
      optional: true,
    },
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currency",
      ],
    },
    docNumber: {
      type: "string",
      label: "Document Number",
      description: "Reference number for the transaction",
      optional: true,
    },
    shippingStreetAddress: {
      propDefinition: [
        quickbooks,
        "shippingStreetAddress",
      ],
    },
    shippingCity: {
      propDefinition: [
        quickbooks,
        "shippingCity",
      ],
    },
    shippingState: {
      propDefinition: [
        quickbooks,
        "shippingState",
      ],
    },
    shippingZip: {
      propDefinition: [
        quickbooks,
        "shippingZip",
      ],
    },
    shippingLatitude: {
      propDefinition: [
        quickbooks,
        "shippingLatitude",
      ],
    },
    shippingLongitude: {
      propDefinition: [
        quickbooks,
        "shippingLongitude",
      ],
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "Memo or note for the purchase order",
      optional: true,
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
        description: "Line items of a purchase order. DetailType is `ItemBasedExpenseLineDetail`. Example: `{ \"DetailType\": \"ItemBasedExpenseLineDetail\", \"Amount\": 100.0, \"ItemBasedExpenseLineDetail\": { \"ItemRef\": { \"name\": \"Services\", \"value\": \"1\" } } }` [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchaseorder#create-a-purchaseorder) for more information.",
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
        label: `Line ${i} - Item/Account ID`,
        options: async ({ page }) => {
          const options = await this.quickbooks.getPropOptions({
            page,
            resource: "Item",
            mapper: ({
              Id: value, Name: label, ExpenseAccountRef,
            }) => {
              if (ExpenseAccountRef) {
                return {
                  value,
                  label,
                };
              }
              return null;
            },
          });
          return options.filter((option) => option !== null);
        },
      };
      props[`amount_${i}`] = {
        type: "string",
        label: `Line ${i} - Amount`,
      };
      props[`quantity_${i}`] = {
        type: "string",
        label: `Line ${i} - Quantity`,
      };
    }
    return props;
  },
  methods: {
    buildLineItems() {
      return buildPurchaseLineItems(this.numLineItems, this);
    },
  },
  async run({ $ }) {
    if (!this.vendorRefValue) {
      throw new ConfigurationError("Vendor is required to create a purchase order.");
    }

    if (!this.numLineItems && !this.lineItemsAsObjects) {
      throw new ConfigurationError("At least one line item is required. Either specify the number of line items or provide line items as objects.");
    }

    const lines = this.lineItemsAsObjects
      ? parseLineItems(this.lineItems)
      : this.buildLineItems();

    if (!lines || lines.length === 0) {
      throw new ConfigurationError("No valid line items were provided.");
    }

    const hasShippingAddress = this.shippingStreetAddress
      || this.shippingCity
      || this.shippingState
      || this.shippingZip
      || this.shippingLatitude
      || this.shippingLongitude;

    const data = {
      Line: lines,
      VendorRef: {
        value: this.vendorRefValue,
      },
      DueDate: this.dueDate,
      DocNumber: this.docNumber,
      ShipAddr: hasShippingAddress
        ? {
          Line1: this.shippingStreetAddress,
          City: this.shippingCity,
          CountrySubDivisionCode: this.shippingState,
          PostalCode: this.shippingZip,
          Lat: this.shippingLatitude,
          Long: this.shippingLongitude,
        }
        : undefined,
      Memo: this.memo,
      APAccountRef: {
        value: this.accountId,
      },
    };

    if (this.currencyRefValue) {
      data.CurrencyRef = {
        value: this.currencyRefValue,
      };
    }

    const response = await this.quickbooks.createPurchaseOrder({
      $,
      data,
    });

    if (response) {
      $.export("$summary", `Successfully created purchase order with ID ${response.PurchaseOrder.Id}`);
    }

    return response;
  },
};

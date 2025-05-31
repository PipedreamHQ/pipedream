import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";
import { 
  parseLineItems,
  buildSalesLineItems,
} from "../../common/utils.mjs";

export default {
  key: "quickbooks-update-invoice",
  name: "Update Invoice",
  description: "Updates an invoice. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#update-an-invoice)",
  version: "0.0.1",
  type: "action",
  props: {
    quickbooks,
    invoiceId: {
      propDefinition: [
        quickbooks,
        "invoiceId",
      ],
    },
    customerRefValue: {
      propDefinition: [
        quickbooks,
        "customer",
      ],
      optional: true,
    },
    billEmail: {
      type: "string",
      label: "Bill Email",
      description: "Email address where the invoice should be sent",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Date when the payment of the transaction is due (YYYY-MM-DD)",
      optional: true,
    },
    allowOnlineCreditCardPayment: {
      type: "boolean",
      label: "Allow Online Credit Card Payment",
      description: "Allow online credit card payment",
      optional: true,
    },
    allowOnlineACHPayment: {
      type: "boolean",
      label: "Allow Online Bank Transfer Payment",
      description: "Allow online bank transfer payment",
      optional: true,
    },
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currency",
      ],
      optional: true,
    },
    docNumber: {
      type: "string",
      label: "Document Number",
      description: "Reference number for the transaction",
      optional: true,
    },
    billAddr: {
      type: "object",
      label: "Billing Address",
      description: "Billing address details",
      optional: true,
    },
    shipAddr: {
      type: "object",
      label: "Shipping Address",
      description: "Shipping address details",
      optional: true,
    },
    trackingNum: {
      type: "string",
      label: "Tracking Number",
      description: "Shipping tracking number",
      optional: true,
    },
    privateNote: {
      type: "string",
      label: "Private Note",
      description: "Private note for internal use",
      optional: true,
    },
    customerMemo: {
      type: "string",
      label: "Customer Memo",
      description: "Memo visible to customer",
      optional: true,
    },
    taxCodeId: {
      propDefinition: [
        quickbooks,
        "taxCodeId",
      ],
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
        description: "Line items of an invoice. Set DetailType to `SalesItemLineDetail`, `GroupLineDetail`, or `DescriptionOnly`. Example: `{ \"DetailType\": \"SalesItemLineDetail\", \"Amount\": 100.0, \"SalesItemLineDetail\": { \"ItemRef\": { \"name\": \"Services\", \"value\": \"1\" } } }`",
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
      return buildSalesLineItems(this.numLineItems, this);
    },
    addIfDefined(target, source, mappings) {
      Object.entries(mappings).forEach(([sourceKey, targetConfig]) => {
        const value = source[sourceKey];
        if (value !== undefined && value !== null) {
          if (typeof targetConfig === "string") {
            target[targetConfig] = value;
          } else if (typeof targetConfig === "object") {
            target[targetConfig.key] = targetConfig.transform ? targetConfig.transform(value) : value;
          }
        }
      });
    },
  },
  async run({ $ }) {
    // Get the current invoice to obtain SyncToken
    const response = await this.quickbooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });

    // Validate that the invoice was found and is valid
    if (!response || !response.Invoice) {
      throw new ConfigurationError(`Invoice with ID '${this.invoiceId}' not found. Please verify the invoice ID is correct.`);
    }

    const invoice = response.Invoice;

    // Validate that the invoice has required properties
    if (!invoice.Id) {
      throw new ConfigurationError(`Invalid invoice data received: missing Invoice ID`);
    }

    if (!invoice.SyncToken) {
      throw new ConfigurationError(`Invalid invoice data received: missing SyncToken. This may indicate the invoice is in an invalid state.`);
    }

    const data = {
      Id: this.invoiceId,
      SyncToken: invoice.SyncToken,
    };

    // Only update fields that are provided
    if (this.customerRefValue) {
      data.CustomerRef = {
        value: this.customerRefValue,
      };
    }

    if (this.lineItemsAsObjects || this.numLineItems) {
      const lines = this.lineItemsAsObjects
        ? parseLineItems(this.lineItems)
        : this.buildLineItems();

      lines.forEach((line, index) => {
        if (line.DetailType !== "SalesItemLineDetail" && line.DetailType !== "GroupLineDetail" && line.DetailType !== "DescriptionOnly") {
          throw new ConfigurationError(`Line Item at index ${index + 1} has invalid DetailType '${line.DetailType}'. Must be 'SalesItemLineDetail', 'GroupLineDetail', or 'DescriptionOnly'`);
        }
      });

      data.Line = lines;
    }

    this.addIfDefined(data, this, {
      dueDate: "DueDate",
      docNumber: "DocNumber",
      billAddr: "BillAddr",
      shipAddr: "ShipAddr",
      trackingNum: "TrackingNum",
      privateNote: "PrivateNote",
    });

    if (typeof this.allowOnlineCreditCardPayment === "boolean") {
      data.AllowOnlineCreditCardPayment = this.allowOnlineCreditCardPayment;
    }
    if (typeof this.allowOnlineACHPayment === "boolean") {
      data.AllowOnlineACHPayment = this.allowOnlineACHPayment;
    }

    if (this.billEmail) {
      data.BillEmail = {
        Address: this.billEmail,
      };
    }

    if (this.currencyRefValue) {
      data.CurrencyRef = {
        value: this.currencyRefValue,
      };
    }

    if (this.customerMemo) {
      data.CustomerMemo = {
        value: this.customerMemo,
      };
    }

    const updateResponse = await this.quickbooks.updateInvoice({
      $,
      data,
    });

    if (updateResponse?.Invoice?.Id) {
      $.export("summary", `Successfully updated invoice with ID ${updateResponse.Invoice.Id}`);
    } else {
      throw new ConfigurationError("Failed to update invoice: Invalid response from QuickBooks API");
    }

    return updateResponse;
  },
}; 
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
  },
  async run({ $ }) {
    // Get the current invoice to obtain SyncToken
    const { Invoice: invoice } = await this.quickbooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });

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

      lines.forEach((line) => {
        if (line.DetailType !== "SalesItemLineDetail" && line.DetailType !== "GroupLineDetail" && line.DetailType !== "DescriptionOnly") {
          throw new ConfigurationError("Line Item DetailType must be `SalesItemLineDetail`, `GroupLineDetail`, or `DescriptionOnly`");
        }
      });

      data.Line = lines;
    }

    if (this.dueDate) data.DueDate = this.dueDate;
    if (typeof this.allowOnlineCreditCardPayment === "boolean") data.AllowOnlineCreditCardPayment = this.allowOnlineCreditCardPayment;
    if (typeof this.allowOnlineACHPayment === "boolean") data.AllowOnlineACHPayment = this.allowOnlineACHPayment;
    if (this.docNumber) data.DocNumber = this.docNumber;
    if (this.billAddr) data.BillAddr = this.billAddr;
    if (this.shipAddr) data.ShipAddr = this.shipAddr;
    if (this.trackingNum) data.TrackingNum = this.trackingNum;
    if (this.privateNote) data.PrivateNote = this.privateNote;

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

    const response = await this.quickbooks.updateInvoice({
      $,
      data,
    });

    if (response) {
      $.export("summary", `Successfully updated invoice with ID ${response.Invoice.Id}`);
    }

    return response;
  },
}; 
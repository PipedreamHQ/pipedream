import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";
import {
  parseLineItems,
  buildSalesLineItems,
  parseObject,
} from "../../common/utils.mjs";

export default {
  key: "quickbooks-create-estimate",
  name: "Create Estimate",
  description: "Creates an estimate. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/estimate#create-an-estimate)",
  version: "0.0.1",
  type: "action",
  props: {
    quickbooks,
    customerRefValue: {
      propDefinition: [
        quickbooks,
        "customer",
      ],
    },
    billEmail: {
      type: "string",
      label: "Bill Email",
      description: "Email address where the estimate should be sent",
      optional: true,
    },
    expirationDate: {
      type: "string",
      label: "Expiration Date",
      description: "Date when the estimate expires (YYYY-MM-DD)",
      optional: true,
    },
    acceptedBy: {
      type: "string",
      label: "Accepted By",
      description: "Name of the customer who accepted the estimate",
      optional: true,
    },
    acceptedDate: {
      type: "string",
      label: "Accepted Date",
      description: "Date when the estimate was accepted (YYYY-MM-DD)",
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
      description: "Billing address details. Example: `{ \"Line1\": \"123 Elm St.\", \"City\": \"Springfield\", \"CountrySubDivisionCode\": \"IL\", \"PostalCode\": \"62701\" }`",
      optional: true,
    },
    shipAddr: {
      type: "object",
      label: "Shipping Address",
      description: "Shipping address details. Example: `{ \"Line1\": \"456 Oak St.\", \"City\": \"Springfield\", \"CountrySubDivisionCode\": \"IL\", \"PostalCode\": \"62701\" }`",
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
        description: "Line items of an estimate. Set DetailType to `SalesItemLineDetail`, `GroupLineDetail`, or `DescriptionOnly`. Example: `{ \"DetailType\": \"SalesItemLineDetail\", \"Amount\": 100.0, \"SalesItemLineDetail\": { \"ItemRef\": { \"name\": \"Services\", \"value\": \"1\" } } }`",
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
    if ((!this.numLineItems && !this.lineItemsAsObjects) || !this.customerRefValue) {
      throw new ConfigurationError("Must provide lineItems and customerRefValue parameters.");
    }

    const lines = this.lineItemsAsObjects
      ? parseLineItems(this.lineItems)
      : this.buildLineItems();

    lines.forEach((line, index) => {
      if (line.DetailType !== "SalesItemLineDetail" && line.DetailType !== "GroupLineDetail" && line.DetailType !== "DescriptionOnly") {
        throw new ConfigurationError(`Line Item at index ${index + 1} has invalid DetailType '${line.DetailType}'. Must be 'SalesItemLineDetail', 'GroupLineDetail', or 'DescriptionOnly'`);
      }
    });

    const params = {};
    const data = {
      Line: lines,
      CustomerRef: {
        value: this.customerRefValue,
      },
      ExpirationDate: this.expirationDate,
      AcceptedBy: this.acceptedBy,
      AcceptedDate: this.acceptedDate,
      DocNumber: this.docNumber,
      BillAddr: parseObject(this.billAddr),
      ShipAddr: parseObject(this.shipAddr),
      PrivateNote: this.privateNote,
    };

    if (this.billEmail) {
      params.include = "estimateLink";
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

    const response = await this.quickbooks.createEstimate({
      $,
      params,
      data,
    });

    if (response) {
      $.export("$summary", `Successfully created estimate with ID ${response.Estimate.Id}`);
    }

    return response;
  },
};

import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";
import {
  parseLineItems,
  buildSalesLineItems,
} from "../../common/utils.mjs";

export default {
  key: "quickbooks-update-estimate",
  name: "Update Estimate",
  description: "Updates an estimate. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/estimate#update-an-estimate)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    estimateId: {
      propDefinition: [
        quickbooks,
        "estimateId",
      ],
    },
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
    billingStreetAddress: {
      propDefinition: [
        quickbooks,
        "billingStreetAddress",
      ],
    },
    billingCity: {
      propDefinition: [
        quickbooks,
        "billingCity",
      ],
    },
    billingState: {
      propDefinition: [
        quickbooks,
        "billingState",
      ],
    },
    billingZip: {
      propDefinition: [
        quickbooks,
        "billingZip",
      ],
    },
    billingLatitude: {
      propDefinition: [
        quickbooks,
        "billingLatitude",
      ],
    },
    billingLongitude: {
      propDefinition: [
        quickbooks,
        "billingLongitude",
      ],
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
        description: "Line items of an estimate. Set DetailType to `SalesItemLineDetail`, `GroupLineDetail`, or `DescriptionOnly`. Example: `{ \"DetailType\": \"SalesItemLineDetail\", \"Amount\": 100.0, \"SalesItemLineDetail\": { \"ItemRef\": { \"name\": \"Services\", \"value\": \"1\" } } }` [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/estimate#update-an-estimate) for more information.",
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
    // Helper function to conditionally add properties
    addIfDefined(target, source, mappings) {
      Object.entries(mappings).forEach(([
        sourceKey,
        targetConfig,
      ]) => {
        const value = source[sourceKey];
        if (value !== undefined && value !== null) {
          if (typeof targetConfig === "string") {
            target[targetConfig] = value;
          } else if (typeof targetConfig === "object") {
            target[targetConfig.key] = targetConfig.transform
              ? targetConfig.transform(value)
              : value;
          }
        }
      });
    },
  },
  async run({ $ }) {
    // Get the current estimate to obtain SyncToken
    const { Estimate: estimate } = await this.quickbooks.getEstimate({
      $,
      estimateId: this.estimateId,
    });

    const hasBillingAddress = this.billingStreetAddress
    || this.billingCity
    || this.billingState
    || this.billingZip
    || this.billingLatitude
    || this.billingLongitude;
    const hasShippingAddress = this.shippingStreetAddress
    || this.shippingCity
    || this.shippingState
    || this.shippingZip
    || this.shippingLatitude
    || this.shippingLongitude;

    const data = {
      Id: this.estimateId,
      SyncToken: estimate.SyncToken,
      BillAddr: hasBillingAddress
        ? {
          Line1: this.billingStreetAddress,
          City: this.billingCity,
          CountrySubDivisionCode: this.billingState,
          PostalCode: this.billingZip,
          Lat: this.billingLatitude,
          Long: this.billingLongitude,
        }
        : undefined,
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

    // Add simple field mapping
    this.addIfDefined(data, this, {
      expirationDate: "ExpirationDate",
      acceptedBy: "AcceptedBy",
      acceptedDate: "AcceptedDate",
      docNumber: "DocNumber",
      privateNote: "PrivateNote",
    });

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

    const response = await this.quickbooks.updateEstimate({
      $,
      data,
    });

    if (response?.Estimate?.Id) {
      $.export("$summary", `Successfully updated estimate with ID ${response.Estimate.Id}`);
    } else {
      throw new ConfigurationError("Failed to update estimate: Invalid response from QuickBooks API");
    }

    return response;
  },
};

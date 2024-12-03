import quickbooks from "../../quickbooks.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "quickbooks-update-item",
  name: "Update Item",
  description: "Updates an item. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#full-update-an-item)",
  version: "0.0.1",
  type: "action",
  props: {
    quickbooks,
    itemId: {
      propDefinition: [
        quickbooks,
        "itemId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the item. This value must be unique.",
    },
    syncToken: {
      type: "string",
      label: "Sync Token",
      description: "Version number of the entity. Required for the update operation.",
    },
    trackQtyOnHand: {
      type: "boolean",
      label: "Track Quantity on Hand",
      description: "True if there is quantity on hand to be tracked. Once this value is true, it cannot be updated to false. Applicable for items of type `Inventory`. Not applicable for `Service` or `NonInventory` item types.",
    },
    sparseUpdate: {
      type: "string",
      label: "Sparse Update",
      description: "When set to `true`, sparse updating provides the ability to update a subset of properties for a given object; only elements specified in the request are updated. Missing elements are left untouched.",
    },
    qtyOnHand: {
      type: "string",
      label: "Quantity on Hand",
      description: "Current quantity of the `Inventory` items available for sale. Not used for `Service` or `NonInventory` type items. Required for `Inventory` type items.",
      optional: true,
    },
    incomeAccountRefValue: {
      type: "string",
      label: "Income Account Ref Value",
      description: "Reference to the posting account, that is, the account that records the proceeds from the sale of this item. Must be an account with account type of `Sales of Product Income`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Id` from that object for `IncomeAccountRef.value`. See specifications for the IncomeAccountRef parameters in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
    },
    incomeAccountRefName: {
      type: "string",
      label: "Income Account Ref Name",
      description: "Reference to the posting account, that is, the account that records the proceeds from the sale of this item. Must be an account with account type of `Sales of Product Income`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Name` from that object for `IncomeAccountRef.name`. See specifications for the IncomeAccountRef parameters in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Classification that specifies the use of this item. See the description at the top of the [Item entity page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item) for details about supported item types. See specifications for the type parameter in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
      options: [
        "Inventory",
        "Group",
        "Service",
        "NonInventory",
      ],
    },
    assetAccountRefValue: {
      type: "string",
      label: "Asset Account Ref Value",
      description: "Required for Inventory item types. Reference to the Inventory Asset account that tracks the current value of the inventory. If the same account is used for all inventory items, the current balance of this account will represent the current total value of the inventory. Must be an account with account type of `Other Current Asset`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Id` from that object for `AssetAccountRef.value`.",
      optional: true,
    },
    assetAccountRefName: {
      type: "string",
      label: "Asset Account Ref Name",
      description: "Required for Inventory item types. Reference to the Inventory Asset account that tracks the current value of the inventory. If the same account is used for all inventory items, the current balance of this account will represent the current total value of the inventory. Must be an account with account type of `Other Current Asset`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Name` from that object for `AssetAccountRef.name`.",
      optional: true,
    },
    invStartDate: {
      type: "string",
      label: "Inventory Start Date",
      description: "Date of opening balance for the inventory transaction. Required when creating an `Item.Type=Inventory`. Required for `Inventory` item types.",
      optional: true,
    },
    expenseAccountRefValue: {
      type: "string",
      label: "Expense Account Ref Value",
      description: "Reference to the expense account used to pay the vendor for this item. Must be an account with account type of `Cost of Goods Sold`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Id` from that object for `ExpenseAccountRef.value`. See specifications for the ExpenseAccountRef parameters in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
    },
    expenseAccountRefName: {
      type: "string",
      label: "Expense Account Ref Name",
      description: "Reference to the expense account used to pay the vendor for this item. Must be an account with account type of `Cost of Goods Sold`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Name` from that object for `ExpenseAccountRef.name`. See specifications for the ExpenseAccountRef parameters in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
    },
    sku: {
      type: "string",
      label: "Sku",
      description: "The stock keeping unit (SKU) for this Item. This is a company-defined identifier for an item or product used in tracking inventory.",
      optional: true,
    },
    salesTaxIncluded: {
      type: "boolean",
      label: "Sales Tax Included",
      description: "True if the sales tax is included in the item amount, and therefore is not calculated for the transaction.",
      optional: true,
    },
    salesTaxCodeRefValue: {
      type: "string",
      label: "Sales Tax Code Ref Value",
      description: "Id of the referenced sales tax code  for the Sales item. Applicable to Service and Sales item types only. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use `TaxCode.Id` from that object for `SalesTaxCodeRef.value`.",
      optional: true,
    },
    salesTaxCodeRefName: {
      type: "string",
      label: "Sales Tax Code Ref Name",
      description: "Name of the referenced sales tax code  for the Sales item. Applicable to Service and Sales item types only. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use `TaxCode.Name` from that object for `SalesTaxCodeRef.name`.",
      optional: true,
    },
    classRefValue: {
      type: "string",
      label: "Class Ref Value",
      description: "Id of the referenced Class for the item. Query the Class name list resource to determine the appropriate object for this reference. Use `Class.Id` from that object for `ClassRef.value`.",
      optional: true,
    },
    classRefName: {
      type: "string",
      label: "Class Ref Name",
      description: "Name of the referenced Class for the item. Query the Class name list resource to determine the appropriate object for this reference. Use `Class.Name` from that object for `ClassRef.name`.",
      optional: true,
    },
    purchaseTaxIncluded: {
      type: "boolean",
      label: "Purchase Tax Included",
      description: "True if the purchase tax is included in the item amount, and therefore is not calculated for the transaction.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the item.",
      optional: true,
    },
    abatementRate: {
      type: "string",
      label: "Abatement Rate",
      description: "Sales tax abatement rate for India locales.",
      optional: true,
    },
    reverseChargeRate: {
      type: "string",
      label: "Reverse Charge Rate",
      description: "Sales tax reverse charge rate for India locales.",
      optional: true,
    },
    subItem: {
      type: "boolean",
      label: "Sub Item",
      description: "If true, this is a sub item. If false or null, this is a top-level item. Creating inventory hierarchies with traditional inventory items is being phased out in lieu of using categories and sub categories.",
      optional: true,
    },
    taxable: {
      type: "boolean",
      label: "Taxable",
      description: "If true, transactions for this item are taxable. Applicable to US companies, only.",
      optional: true,
    },
    UqcDisplayText: {
      type: "string",
      label: "UQC Display Text",
      description: "Text to be displayed on customer's invoice to denote the Unit of Measure (instead of the standard code).",
      optional: true,
    },
    reorderPoint: {
      type: "string",
      label: "Reorder Point",
      description: "The minimum quantity of a particular inventory item that you need to restock at any given time. The ReorderPoint value cannot be set to null for sparse updates(sparse=true). It can be set to null only for full updates.",
      optional: true,
    },
    purchaseDesc: {
      type: "string",
      label: "Purchase Description",
      description: "Purchase description for the item.",
      optional: true,
    },
    prefVendorRefValue: {
      type: "string",
      label: "Pref Vendor Ref Value",
      description: "Pref vendor ref value",
      optional: true,
    },
    prefVendorRefName: {
      type: "string",
      label: "Pref Vendor Ref Name",
      description: "Pref vendor ref name",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "If true, the object is currently enabled for use by QuickBooks.",
      optional: true,
    },
    UqcId: {
      type: "string",
      label: "UQC ID",
      description: "Id of Standard Unit of Measure (UQC:Unique Quantity Code) of the item according to GST rule.",
      optional: true,
    },
    purchaseTaxCodeRefValue: {
      type: "string",
      label: "Purchase Tax Code Ref Value",
      description: "The ID for the referenced purchase tax code object as found in the Id field of the object payload. \n\nReference to the purchase tax code for the item. Applicable to Service, Other Charge, and Product (Non-Inventory) item types. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use `TaxCode.Id` from that object for `PurchaseTaxCodeRef.value`.",
      optional: true,
    },
    purchaseTaxCodeRefName: {
      type: "string",
      label: "Purchase Tax Code Ref Name",
      description: "An identifying name for the purchase tax code object being referenced by value and is derived from the field that holds the common name of that object. \n\nReference to the purchase tax code for the item. Applicable to Service, Other Charge, and Product (Non-Inventory) item types. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use `TaxCode.Name` from that object for `PurchaseTaxCodeRef.name`.",
      optional: true,
    },
    serviceType: {
      type: "string",
      label: "Service Type",
      description: "Sales tax service type for India locales.",
      optional: true,
    },
    purchaseCost: {
      type: "string",
      label: "Purchase Cost",
      description: "Amount paid when buying or ordering the item, as expressed in the home currency.",
      optional: true,
    },
    unitPrice: {
      type: "string",
      label: "Unit Price",
      description: "Corresponds to the Price/Rate column on the QuickBooks Online UI to specify either unit price, a discount, or a tax rate for item. If used for unit price, the monetary value of the service or product, as expressed in the home currency. If used for a discount or tax rate, express the percentage as a fraction. For example, specify `0.4` for 40% tax",
      optional: true,
    },
    taxClassificationRefValue: {
      type: "string",
      label: "Tax Classification Ref Value",
      description: "The ID for the referenced Tax classification object as found in the Id field of the object payload.\n\nTax classification segregates different items into different classifications and the tax classification is one of the key parameters to determine appropriate tax on transactions involving items. Tax classifications are sourced by either tax governing authorities as in India/Malaysia or externally like Exactor. 'Fuel', 'Garments' and 'Soft drinks' are a few examples of tax classification in layman terms. User can choose a specific tax classification for an item while creating it. A level 1 tax classification cannot be associated to an Item",
      optional: true,
    },
    taxClassificationRefName: {
      type: "string",
      label: "Tax Classification Ref Name",
      description: "An identifying name for the Tax classification object being referenced by value and is derived from the field that holds the common name of that object.",
      optional: true,
    },
    parentRefName: {
      type: "string",
      label: "Parent Ref Name",
      description: "An identifying name for the parent item object being referenced by `value` and is derived from the field that holds the common name of that object.\n\nThe immediate parent of the sub item in the hierarchical Category:Sub-category list. If SubItem is true, then ParenRef is required. Query the Item name list resource to determine the appropriate object for this reference. Use `Item.Id` from that object for `ParentRef.value`.",
      optional: true,
    },
    parentRefValue: {
      type: "string",
      label: "Parent Ref Value",
      description: "The ID for the referenced parent item object as found in the Id field of the object payload. \n\nThe immediate parent of the sub item in the hierarchical Category:Sub-category list. If SubItem is true, then ParenRef is required. Query the Item name list resource to determine the appropriate object for this reference. Use `Item.Id` from that object for `ParentRef.value`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.itemId
      || !this.name
      || !this.syncToken
      || this.trackQtyOnHand === undefined
      || this.sparseUpdate === undefined
    ) {
      throw new ConfigurationError("Must provide itemId, name, syncToken, and trackQtyOnHand parameters.");
    }

    const data = {
      sparse: this.sparseUpdate,
      Id: this.itemId,
      Name: this.name,
      QtyOnHand: this.qtyOnHand,
      SyncToken: this.syncToken,
      IncomeAccountRef: {
        value: this.incomeAccountRefValue,
        name: this.incomeAccountRefName,
      },
      Type: this.type,
      AssetAccountRef: {
        value: this.assetAccountRefValue,
        name: this.assetAccountRefName,
      },
      InvStartDate: this.invStartDate,
      ExpenseAccountRef: {
        value: this.expenseAccountRefValue,
        name: this.expenseAccountRefName,
      },
      Sku: this.sku,
      SalesTaxIncluded: this.salesTaxIncluded,
      TrackQtyOnHand: this.trackQtyOnHand,
      SalesTaxCodeRef: {
        value: this.salesTaxCodeRefValue,
        name: this.salesTaxCodeRefName,
      },
      ClassRef: {
        value: this.classRefValue,
        name: this.classRefName,
      },
      PurchaseTaxIncluded: this.purchaseTaxIncluded,
      Description: this.description,
      AbatementRate: this.abatementRate,
      ReverseChargeRate: this.reverseChargeRate,
      SubItem: this.subItem,
      Taxable: this.taxable,
      UQCDisplayText: this.UqcDisplayText,
      ReorderPoint: this.reorderPoint,
      PurchaseDesc: this.purchaseDesc,
      PrefVendorRef: {
        value: this.prefVendorRefValue,
        name: this.prefVendorRefName,
      },
      Active: this.active,
      UQCId: this.UqcId,
      PurchaseTaxCodeRef: {
        value: this.purchaseTaxCodeRefValue,
        name: this.purchaseTaxCodeRefName,
      },
      ServiceType: this.serviceType,
      PurchaseCost: this.purchaseCost,
      UnitPrice: this.unitPrice,
      TaxClassificationRef: {
        value: this.taxClassificationRefValue,
        name: this.taxClassificationRefName,
      },
    };

    if (this.parentRefValue || this.parentRefName) {
      data["ParentRef"] = {
        value: this.parentRefValue,
        name: this.parentRefName,
      };
    }

    const response = await this.quickbooks.updateItem({
      $,
      data,
    });

    if (response) {
      $.export("summary", `Successfully updated item with id ${this.itemId}`);
    }

    return response;
  },
};

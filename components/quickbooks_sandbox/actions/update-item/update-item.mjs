// legacy_hash_id: a_bKil4n
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks_sandbox-update-item",
  name: "Update Item",
  description: "Updates an item.",
  version: "0.2.1",
  type: "action",
  props: {
    quickbooks_sandbox: {
      type: "app",
      app: "quickbooks_sandbox",
    },
    item_id: {
      type: "string",
      description: "Id of the item to update.",
    },
    name: {
      type: "string",
      description: "Name of the item. This value must be unique.",
    },
    sync_token: {
      type: "string",
      description: "Version number of the entity. Required for the update operation.",
    },
    track_qty_on_hand: {
      type: "boolean",
      description: "True if there is quantity on hand to be tracked. Once this value is true, it cannot be updated to false. Applicable for items of type `Inventory`. Not applicable for `Service` or `NonInventory` item types.",
    },
    sparse_update: {
      type: "string",
      description: "When set to `true`, sparse updating provides the ability to update a subset of properties for a given object; only elements specified in the request are updated. Missing elements are left untouched.",
    },
    qty_on_hand: {
      type: "string",
      description: "Current quantity of the `Inventory` items available for sale. Not used for `Service` or `NonInventory` type items. Required for `Inventory` type items.",
      optional: true,
    },
    income_account_ref_value: {
      type: "string",
      description: "Reference to the posting account, that is, the account that records the proceeds from the sale of this item. Must be an account with account type of `Sales of Product Income`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Id` from that object for `IncomeAccountRef.value`. See specifications for the IncomeAccountRef parameters in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
    },
    income_account_ref_name: {
      type: "string",
      description: "Reference to the posting account, that is, the account that records the proceeds from the sale of this item. Must be an account with account type of `Sales of Product Income`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Name` from that object for `IncomeAccountRef.name`. See specifications for the IncomeAccountRef parameters in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
    },
    type: {
      type: "string",
      description: "Classification that specifies the use of this item. See the description at the top of the [Item entity page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item) for details about supported item types. See specifications for the type parameter in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
      options: [
        "Inventory",
        "Group",
        "Service",
        "NonInventory",
      ],
    },
    asset_account_ref_value: {
      type: "string",
      description: "Required for Inventory item types. Reference to the Inventory Asset account that tracks the current value of the inventory. If the same account is used for all inventory items, the current balance of this account will represent the current total value of the inventory. Must be an account with account type of `Other Current Asset`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Id` from that object for `AssetAccountRef.value`.",
      optional: true,
    },
    asset_account_ref_name: {
      type: "string",
      description: "Required for Inventory item types. Reference to the Inventory Asset account that tracks the current value of the inventory. If the same account is used for all inventory items, the current balance of this account will represent the current total value of the inventory. Must be an account with account type of `Other Current Asset`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Name` from that object for `AssetAccountRef.name`.",
      optional: true,
    },
    inv_start_date: {
      type: "string",
      description: "Date of opening balance for the inventory transaction. Required when creating an `Item.Type=Inventory`. Required for `Inventory` item types.",
      optional: true,
    },
    expense_account_ref_value: {
      type: "string",
      description: "Reference to the expense account used to pay the vendor for this item. Must be an account with account type of `Cost of Goods Sold`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Id` from that object for `ExpenseAccountRef.value`. See specifications for the ExpenseAccountRef parameters in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
    },
    expense_account_ref_name: {
      type: "string",
      description: "Reference to the expense account used to pay the vendor for this item. Must be an account with account type of `Cost of Goods Sold`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Name` from that object for `ExpenseAccountRef.name`. See specifications for the ExpenseAccountRef parameters in the [Create an item page](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#create-an-item).",
      optional: true,
    },
    Sku: {
      type: "string",
      description: "The stock keeping unit (SKU) for this Item. This is a company-defined identifier for an item or product used in tracking inventory.",
      optional: true,
    },
    sales_tax_included: {
      type: "string",
      description: "True if the sales tax is included in the item amount, and therefore is not calculated for the transaction.",
      optional: true,
    },
    sales_tax_code_ref_value: {
      type: "string",
      description: "Id of the referenced sales tax code  for the Sales item. Applicable to Service and Sales item types only. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use `TaxCode.Id` from that object for `SalesTaxCodeRef.value`.",
      optional: true,
    },
    sales_tax_code_ref_name: {
      type: "string",
      description: "Name of the referenced sales tax code  for the Sales item. Applicable to Service and Sales item types only. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use `TaxCode.Name` from that object for `SalesTaxCodeRef.name`.",
      optional: true,
    },
    class_ref_value: {
      type: "string",
      description: "Id of the referenced Class for the item. Query the Class name list resource to determine the appropriate object for this reference. Use `Class.Id` from that object for `ClassRef.value`.",
      optional: true,
    },
    class_ref_name: {
      type: "string",
      description: "Name of the referenced Class for the item. Query the Class name list resource to determine the appropriate object for this reference. Use `Class.Name` from that object for `ClassRef.name`.",
      optional: true,
    },
    purchase_tax_tncluded: {
      type: "boolean",
      description: "True if the purchase tax is included in the item amount, and therefore is not calculated for the transaction.",
      optional: true,
    },
    description: {
      type: "string",
      description: "Description of the item.",
      optional: true,
    },
    abatement_rate: {
      type: "string",
      description: "Sales tax abatement rate for India locales.",
      optional: true,
    },
    reverse_charge_rate: {
      type: "string",
      description: "Sales tax reverse charge rate for India locales.",
      optional: true,
    },
    sub_item: {
      type: "boolean",
      description: "If true, this is a sub item. If false or null, this is a top-level item. Creating inventory hierarchies with traditional inventory items is being phased out in lieu of using categories and sub categories.",
      optional: true,
    },
    taxable: {
      type: "boolean",
      description: "If true, transactions for this item are taxable. Applicable to US companies, only.",
      optional: true,
    },
    UQC_display_text: {
      type: "string",
      description: "Text to be displayed on customer's invoice to denote the Unit of Measure (instead of the standard code).",
      optional: true,
    },
    reorder_point: {
      type: "string",
      description: "The minimum quantity of a particular inventory item that you need to restock at any given time. The ReorderPoint value cannot be set to null for sparse updates(sparse=true). It can be set to null only for full updates.",
      optional: true,
    },
    purchase_desc: {
      type: "string",
      description: "Purchase description for the item.",
      optional: true,
    },
    pref_vendor_ref_value: {
      type: "string",
      optional: true,
    },
    pref_vendor_ref_name: {
      type: "string",
      optional: true,
    },
    active: {
      type: "boolean",
      description: "If true, the object is currently enabled for use by QuickBooks.",
      optional: true,
    },
    UQC_id: {
      type: "string",
      description: "Id of Standard Unit of Measure (UQC:Unique Quantity Code) of the item according to GST rule.",
      optional: true,
    },
    purchase_tax_code_ref_value: {
      type: "string",
      description: "The ID for the referenced purchase tax code object as found in the Id field of the object payload. \n\nReference to the purchase tax code for the item. Applicable to Service, Other Charge, and Product (Non-Inventory) item types. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use `TaxCode.Id` from that object for `PurchaseTaxCodeRef.value`.",
      optional: true,
    },
    purchase_tax_code_ref_name: {
      type: "string",
      description: "An identifying name for the purchase tax code object being referenced by value and is derived from the field that holds the common name of that object. \n\nReference to the purchase tax code for the item. Applicable to Service, Other Charge, and Product (Non-Inventory) item types. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use `TaxCode.Name` from that object for `PurchaseTaxCodeRef.name`.",
      optional: true,
    },
    service_type: {
      type: "string",
      description: "Sales tax service type for India locales.",
      optional: true,
    },
    purchase_cost: {
      type: "string",
      description: "Amount paid when buying or ordering the item, as expressed in the home currency.",
      optional: true,
    },
    unit_price: {
      type: "string",
      description: "Corresponds to the Price/Rate column on the QuickBooks Online UI to specify either unit price, a discount, or a tax rate for item. If used for unit price, the monetary value of the service or product, as expressed in the home currency. If used for a discount or tax rate, express the percentage as a fraction. For example, specify `0.4` for 40% tax",
      optional: true,
    },
    tax_classification_ref_value: {
      type: "string",
      description: "The ID for the referenced Tax classification object as found in the Id field of the object payload.\n\nTax classification segregates different items into different classifications and the tax classification is one of the key parameters to determine appropriate tax on transactions involving items. Tax classifications are sourced by either tax governing authorities as in India/Malaysia or externally like Exactor. 'Fuel', 'Garments' and 'Soft drinks' are a few examples of tax classification in layman terms. User can choose a specific tax classification for an item while creating it. A level 1 tax classification cannot be associated to an Item",
      optional: true,
    },
    tax_classification_ref_name: {
      type: "string",
      description: "An identifying name for the Tax classification object being referenced by value and is derived from the field that holds the common name of that object.",
      optional: true,
    },
    parent_ref_name: {
      type: "string",
      description: "An identifying name for the parent item object being referenced by `value` and is derived from the field that holds the common name of that object.\n\nThe immediate parent of the sub item in the hierarchical Category:Sub-category list. If SubItem is true, then ParenRef is required. Query the Item name list resource to determine the appropriate object for this reference. Use `Item.Id` from that object for `ParentRef.value`.",
      optional: true,
    },
    parent_ref_value: {
      type: "string",
      description: "The ID for the referenced parent item object as found in the Id field of the object payload. \n\nThe immediate parent of the sub item in the hierarchical Category:Sub-category list. If SubItem is true, then ParenRef is required. Query the Item name list resource to determine the appropriate object for this reference. Use `Item.Id` from that object for `ParentRef.value`.",
      optional: true,
    },
    minorversion: {
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  //See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#full-update-an-item

    if (!this.item_id || !this.name || !this.sync_token || this.track_qty_on_hand === undefined || this.sparse_update === undefined) {
      throw new Error("Must provide item_id, name, sync_token, and track_qty_on_hand parameters.");
    }

    //Prepares the request body
    var data = {
      sparse: this.sparse_update,
      Id: this.item_id,
      Name: this.name,
      QtyOnHand: this.qty_on_hand,
      SyncToken: this.sync_token,
      IncomeAccountRef: {
        value: this.income_account_ref_value,
        name: this.income_account_ref_name,
      },
      Type: this.type,
      AssetAccountRef: {
        value: this.asset_account_ref_value,
        name: this.asset_account_ref_name,
      },
      InvStartDate: this.inv_start_date,
      ExpenseAccountRef: {
        value: this.expense_account_ref_value,
        name: this.expense_account_ref_name,
      },
      Sku: this.Sku,
      SalesTaxIncluded: this.sales_tax_included,
      TrackQtyOnHand: this.track_qty_on_hand,
      SalesTaxCodeRef: {
        value: this.sales_tax_code_ref_value,
        name: this.sales_tax_code_ref_name,
      },
      ClassRef: {
        value: this.class_ref_value,
        name: this.class_ref_name,
      },
      PurchaseTaxIncluded: this.purchase_tax_tncluded,
      Description: this.description,
      AbatementRate: this.abatement_rate,
      ReverseChargeRate: this.reverse_charge_rate,
      SubItem: this.sub_item,
      Taxable: this.taxable,
      UQCDisplayText: this.UQC_display_text,
      ReorderPoint: this.reorder_point,
      PurchaseDesc: this.purchase_desc,
      PrefVendorRef: {
        value: this.pref_vendor_ref_value,
        name: this.pref_vendor_ref_name,
      },
      Active: this.active,
      UQCId: this.UQC_id,
      PurchaseTaxCodeRef: {
        value: this.purchase_tax_code_ref_value,
        name: this.purchase_tax_code_ref_name,
      },
      ServiceType: this.service_type,
      PurchaseCost: this.purchase_cost,
      UnitPrice: this.unit_price,
      TaxClassificationRef: {
        value: this.tax_classification_ref_value,
        name: this.tax_classification_ref_name,
      },
    };

    if (this.pref_vendor_ref_value || this.parent_ref_name) {
      data["ParentRef"] = {
        value: this.parent_ref_value,
        name: this.parent_ref_name,
      };
    }

    //Sends the request against Quickbooks Sandbox API
    return await axios($, {
      method: "post",
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${this.quickbooks_sandbox.$auth.company_id}/item`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks_sandbox.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
      data,
      params: {
        minorversion: this.minorversion,
      },
    });
  },
};

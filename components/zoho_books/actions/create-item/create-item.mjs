// legacy_hash_id: a_Xzi1qo
import {
  ITEM_TYPE_OPTIONS, PRODUCT_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-create-item",
  name: "Create Item",
  description: "Creates a new item. [See the documentation](https://www.zoho.com/books/api/v3/items/#create-an-item)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoBooks,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the item. Max-length [100]",
    },
    rate: {
      type: "string",
      label: "Rate",
      description: "Price of the item.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description for the item. Max-length [2000]",
      optional: true,
    },
    taxId: {
      propDefinition: [
        zohoBooks,
        "taxId",
      ],
      description: "ID of the tax to be associated to the item.",
      optional: true,
    },
    taxPercentage: {
      type: "string",
      label: "Tax Percentage",
      description: "Percent of the tax.",
      optional: true,
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "SKU value of item,should be unique throughout the product",
      optional: true,
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "Specify the type of an item.",
      optional: true,
      options: PRODUCT_TYPE_OPTIONS,
    },
    hsnOrSac: {
      type: "string",
      label: "HSN Or SAC",
      description: "HSN Code.",
      optional: true,
    },
    isTaxable: {
      type: "boolean",
      label: "Is Taxable",
      description: "Boolean to track the taxability of the item.",
      optional: true,
    },
    taxExemptionId: {
      type: "string",
      label: "Tax Exemption Id",
      description: "ID of the tax exemption. Mandatory, if is_taxable is false.",
      optional: true,
    },
    accountId: {
      propDefinition: [
        zohoBooks,
        "accountId",
      ],
      description: "ID of the account to which the item has to be associated with.",
      optional: true,
    },
    itemType: {
      type: "string",
      label: "Item Type",
      description: "Type of the item. Default value will be sales.",
      optional: true,
      options: ITEM_TYPE_OPTIONS,
    },
    purchaseDescription: {
      type: "string",
      label: "Purchase Description",
      description: "Purchase description for the item.",
      optional: true,
    },
    purchaseRate: {
      type: "string",
      label: "Purchase Rate",
      description: "Purchase price of the item.",
      optional: true,
    },
    purchaseAccountId: {
      type: "string",
      label: "Purchase Account Id",
      description: "ID of the COGS account to which the item has to be associated with. Mandatory, if item_type is purchase / sales and purchase / inventory.",
      optional: true,
    },
    inventoryAccountId: {
      type: "string",
      label: "Inventory Account Id",
      description: "ID of the stock account to which the item has to be associated with. Mandatory, if item_type is inventory.",
      optional: true,
    },
    vendorId: {
      type: "string",
      label: "Vendor Id",
      description: "Preferred vendor ID.",
      optional: true,
    },
    reorderLevel: {
      type: "string",
      label: "Reorder Level",
      description: "Reorder level of the item.",
      optional: true,
    },
    initialStock: {
      type: "string",
      label: "Initial Stock",
      description: "Opening stock of the item.",
      optional: true,
    },
    initialStockRate: {
      type: "string",
      label: "Initial Stock Rate",
      description: "Unit price of the opening stock.",
      optional: true,
    },
    itemTaxPreferences: {
      type: "string[]",
      label: "Item Tax Preferences",
      description: "A list of item tax objects. **Format: {\"tax_id\":\"12312312031200\",\"tax_specification\":\"intra\"}**",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zohoBooks.createItem({
      $,
      data: {
        name: this.name,
        rate: this.rate && parseFloat(this.rate),
        description: this.description,
        tax_id: this.taxId,
        tax_percentage: this.taxPercentage,
        sku: this.sku,
        product_type: this.productType,
        hsn_or_sac: this.hsnOrSac,
        is_taxable: this.isTaxable,
        tax_exemption_id: this.taxExemptionId,
        account_id: this.accountId,
        item_type: this.itemType,
        purchase_description: this.purchaseDescription,
        purchase_rate: this.purchaseRate,
        purchase_account_id: this.purchaseAccountId,
        inventory_account_id: this.inventoryAccountId,
        vendor_id: this.vendorId,
        reorder_level: this.reorderLevel,
        initial_stock: this.initialStock,
        initial_stock_rate: this.initialStockRate,
        item_tax_preferences: parseObject(this.itemTaxPreferences),
      },
    });

    $.export("$summary", `Item successfully created with Id: ${response.item.item_id}`);
    return response;
  },
};

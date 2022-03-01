// legacy_hash_id: a_Xzi1qo
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-create-item",
  name: "Create Item",
  description: "Creates a new item.",
  version: "0.2.1",
  type: "action",
  props: {
    zoho_books: {
      type: "app",
      app: "zoho_books",
    },
    organization_id: {
      type: "string",
      description: "In Zoho Books, your business is termed as an organization. If you have multiple businesses, you simply set each of those up as an individual organization. Each organization is an independent Zoho Books Organization with it's own organization ID, base currency, time zone, language, contacts, reports, etc.\n\nThe parameter `organization_id` should be sent in with every API request to identify the organization.\n\nThe `organization_id` can be obtained from the GET `/organizations` API's JSON response. Alternatively, it can be obtained from the **Manage Organizations** page in the admin console.",
    },
    name: {
      type: "string",
      description: "Name of the item. Max-length [100]",
    },
    rate: {
      type: "string",
      description: "Price of the item.",
    },
    description: {
      type: "string",
      description: "Description for the item. Max-length [2000]",
      optional: true,
    },
    tax_id: {
      type: "string",
      description: "ID of the tax to be associated to the item.",
      optional: true,
    },
    tax_percentage: {
      type: "string",
      description: "Percent of the tax.",
      optional: true,
    },
    sku: {
      type: "string",
      description: "SKU value of item,should be unique throughout the product",
      optional: true,
    },
    product_type: {
      type: "string",
      description: "Specify the type of an item. Allowed values: `goods` or `service` or `digital_service`.",
      optional: true,
      options: [
        "goods",
        "service",
        "digital_service",
      ],
    },
    hsn_or_sac: {
      type: "string",
      description: "HSN Code.",
      optional: true,
    },
    is_taxable: {
      type: "boolean",
      description: "Boolean to track the taxability of the item.",
      optional: true,
    },
    tax_exemption_id: {
      type: "string",
      description: "ID of the tax exemption. Mandatory, if is_taxable is false.",
      optional: true,
    },
    account_id: {
      type: "string",
      description: "ID of the account to which the item has to be associated with.",
      optional: true,
    },
    avatax_tax_code: {
      type: "string",
      description: "A tax code is a unique label used to group Items (products, services, or charges) together. Max-length [25]",
      optional: true,
    },
    avatax_use_code: {
      type: "string",
      description: "Used to group like customers for exemption purposes. It is a custom value that links customers to a tax rule. Select from Avalara [standard codes][1] or enter a custom code. Max-length [25]",
      optional: true,
    },
    item_type: {
      type: "string",
      description: "Type of the item. Allowed values: `sales`,`purchases`,`sales_and_purchases` and `inventory`. Default value will be sales.",
      optional: true,
      options: [
        "sales",
        "purchases",
        "sales_and_purchases",
        "inventory",
      ],
    },
    purchase_description: {
      type: "string",
      description: "Purchase description for the item.",
      optional: true,
    },
    purchase_rate: {
      type: "string",
      description: "Purchase price of the item.",
      optional: true,
    },
    purchase_account_id: {
      type: "string",
      description: "ID of the COGS account to which the item has to be associated with. Mandatory, if item_type is purchase / sales and purchase / inventory.",
      optional: true,
    },
    inventory_account_id: {
      type: "string",
      description: "ID of the stock account to which the item has to be associated with. Mandatory, if item_type is inventory.",
      optional: true,
    },
    vendor_id: {
      type: "string",
      description: "Preferred vendor ID.",
      optional: true,
    },
    reorder_level: {
      type: "string",
      description: "Reorder level of the item.",
      optional: true,
    },
    initial_stock: {
      type: "string",
      description: "Opening stock of the item.",
      optional: true,
    },
    initial_stock_rate: {
      type: "string",
      description: "Unit price of the opening stock.",
      optional: true,
    },
    item_tax_preferences: {
      type: "any",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://www.zoho.com/books/api/v3/#Items_Create_an_Item

    if (!this.organization_id || !this.name || !this.rate) {
      throw new Error("Must provide organization_id, name, and rate parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/items?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
      data: {
        name: this.name,
        rate: this.rate,
        description: this.description,
        tax_id: this.tax_id,
        tax_percentage: this.tax_percentage,
        sku: this.sku,
        product_type: this.product_type,
        hsn_or_sac: this.hsn_or_sac,
        is_taxable: this.is_taxable,
        tax_exemption_id: this.tax_exemption_id,
        account_id: this.account_id,
        avatax_tax_code: this.avatax_tax_code,
        avatax_use_code: this.avatax_use_code,
        item_type: this.item_type,
        purchase_description: this.purchase_description,
        purchase_rate: this.purchase_rate,
        purchase_account_id: this.purchase_account_id,
        inventory_account_id: this.inventory_account_id,
        vendor_id: this.vendor_id,
        reorder_level: this.reorder_level,
        initial_stock: this.initial_stock,
        initial_stock_rate: this.initial_stock_rate,
        item_tax_preferences: this.item_tax_preferences,
      },
    });
  },
};

const PROPS = {
  name: {
    type: "string",
    label: "Name",
    description:
        "The product name. >= 1 characters <= 250 characters",
  },
  type: {
    type: "string",
    label: "Type",
    description:
        "The product type. One of: physical - a physical stock unit, digital - a digital download. Allowed values: physical digital Example: physical",
    options: [
      "physical",
      "digital",
    ],
  },
  sku: {
    type: "string",
    label: "SKU",
    description:
        "User defined product code/stock keeping unit (SKU). >= 0 characters <= 255 characters Example: SM-13",
    optional: true,
  },
  description: {
    type: "string",
    label: "Description",
    description: "The product description, which can include HTML formatting.",
    optional: true,
  },
  weight: {
    type: "any",
    label: "Weight",
    description:
        "Weight of the product, which can be used when calculating shipping costs. This is based on the unit set on the store >= 0 and <= 9999999999",
  },
  width: {
    type: "any",
    label: "Width",
    description:
        "Width of the product, which can be used when calculating shipping costs. >= 0 and <= 9999999999",
    optional: true,
  },
  depth: {
    type: "any",
    label: "Depth",
    description:
        "Depth of the product, which can be used when calculating shipping costs. >= 0 and <= 9999999999",
    optional: true,
  },
  height: {
    type: "any",
    label: "Height",
    description:
        "Height of the product, which can be used when calculating shipping costs. >= 0 and <= 9999999999",
    optional: true,
  },
  price: {
    type: "any",
    label: "Price",
    description:
        "The price of the product. The price should include or exclude tax, based on the store settings. >= 0",
  },
  cost_price: {
    type: "any",
    label: "Cost Price",
    description:
        "The cost price of the product. Stored for reference only; it is not used or displayed anywhere on the store. >=0",
    optional: true,
  },
  retail_price: {
    type: "any",
    label: "Retail Price",
    description:
        "The retail cost of the product. If entered, the retail cost price will be shown on the product page. >=0",
    optional: true,
  },
  sale_price: {
    type: "any",
    label: "Sale Price",
    description:
        "If entered, the sale price will be used instead of value in the price field when calculating the product's cost. >=0",
    optional: true,
  },
  map_price: {
    type: "integer",
    label: "Map Price",
    description: "Minimum Advertised Price",
    optional: true,
  },
  tax_class_id: {
    type: "integer",
    label: "Tax class id",
    description:
        "The ID of the tax class applied to the product. (NOTE: Value ignored if automatic tax is enabled.) >= 0 and <= 1000000000",
    optional: true,
    async options({ page }) {
      const taxes = await this.bigcommerce.getAllTaxClasses({
        page: page + 1,
      });
      return taxes.map((item) => ({
        label: item.name,
        value: parseInt(item.id),
      }));
    },
  },
  product_tax_code: {
    type: "string",
    label: "Product tax code",
    description:
        "Accepts AvaTax System Tax Codes, which identify products and services that fall into special sales-tax categories. By using these codes, merchants who subscribe to BigCommerce's Avalara Premium integration can calculate sales taxes more accurately. Stores without Avalara Premium will ignore the code when calculating sales tax. Do not pass more than one code. The codes are case-sensitive. For details, please see Avalara's documentation. >= 0 characters <= 255 characters",
    optional: true,
  },
  categories: {
    type: "integer[]",
    label: "Categories",
    description:
        "An array of IDs for the categories to which this product belongs. When updating a product, if an array of categories is supplied, all product categories will be overwritten. Does not accept more than 1,000 ID values.",
    optional: true,
    async options({ page }) {
      const categories = await this.bigcommerce.getAllCategories({
        page: page + 1,
      });
      return categories.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    },
  },
  brand_id: {
    type: "integer",
    label: "Brand Id",
    description:
        "A product can be added to an existing brand during a product /PUT or /POST. >= 0 and <= 1000000000",
    optional: true,
    async options({ page }) {
      const { data } = await this.bigcommerce.getAllBrands({
        page: page + 1,
      });

      return data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    },
  },
  inventory_level: {
    type: "integer",
    label: "Inventory Level",
    description:
        "Current inventory level of the product. Simple inventory tracking must be enabled (See the inventory_tracking field) for this to take any effect. >= 0 and <= 1000000000",
    optional: true,
  },
  inventory_warning_level: {
    type: "integer",
    label: "Inventory Warning Level",
    description:
        "Inventory warning level for the product. When the product's inventory level drops below the warning level, the store owner will be informed. Simple inventory tracking must be enabled (see the inventory_tracking field) for this to take any effect. >= 0 and <= 1000000000",
    optional: true,
  },
  inventory_tracking: {
    type: "string",
    label: "Inventory Tracking",
    description:
        "The type of inventory tracking for the product. Values are: none - inventory levels will not be tracked; product - inventory levels will be tracked using the inventory_level and inventory_warning_level fields; variant - inventory levels will be tracked based on variants, which maintain their own warning levels and inventory levels. Allowed values: none, product, variant",
    optional: true,
    options: [
      "none",
      "product",
      "variant",
    ],
  },
  fixed_cost_shipping_price: {
    type: "any",
    label: "Fixed cost shipping price",
    description:
        "A fixed shipping cost for the product. If defined, this value will be used during checkout instead of normal shipping-cost calculation. >= 0",
    optional: true,
  },
  is_free_shipping: {
    type: "boolean",
    label: "Is free shipping",
    description:
        "Flag used to indicate whether the product has free shipping. If true, the shipping cost for the product will be zero.",
    optional: true,
  },
  is_visible: {
    type: "boolean",
    label: "Is visible",
    description:
        "Flag to determine whether the product should be displayed to customers browsing the store. If true, the product will be displayed. If false, the product will be hidden from view.",
    optional: true,
  },
  is_featured: {
    type: "boolean",
    label: "Is Featured",
    description:
        "Flag to determine whether the product should be included in the featured products panel when viewing the store.",
    optional: true,
  },
  related_products: {
    type: "integer[]",
    label: "Related Products",
    description: "An array of IDs for the related products.",
    optional: true,
    async options({ page }) {
      const { data } = await this.bigcommerce.getAllProducts({
        page: page + 1,
      });

      return data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    },
  },
  warranty: {
    type: "string",
    label: "Warranty",
    description:
        "Warranty information displayed on the product page. Can include HTML formatting. >= 0 characters and <= 65535 characters",
    optional: true,
  },
  bin_picking_number: {
    type: "string",
    label: "Bin picking number",
    description:
        "The BIN picking number for the product. >= 0 characters and <= 255 characters",
    optional: true,
  },
  layout_file: {
    type: "string",
    label: "Layout File",
    description:
        "The layout template file used to render this product category. This field is writable only for stores with a Blueprint theme applied. >= 0 characters and <= 500 characters",
    optional: true,
  },
  upc: {
    type: "string",
    label: "UPC",
    description:
        "The product UPC code, which is used in feeds for shopping comparison sites and external channel integrations. >= 0 characters and <= 255 characters",
    optional: true,
  },
  search_keywords: {
    type: "string",
    label: "Seach keywords",
    description:
        "A comma-separated list of keywords that can be used to locate the product when searching the store. >= 0 characters and <= 65535 characters",
    optional: true,
  },
  availability: {
    type: "string",
    label: "Availability",
    description:
        "Availability of the product. (Corresponds to the product's Purchasability section in the control panel.) Supported values: available - the product is available for purchase; disabled - the product is listed on the storefront, but cannot be purchased; preorder - the product is listed for pre-orders. Allowed values: available, disabled or preorder",
    optional: true,
    options: [
      "available",
      "disabled",
      "preorder",
    ],
  },
  availability_description: {
    type: "string",
    label: "Availability description",
    description:
        "Availability text displayed on the checkout page, under the product title. Tells the customer how long it will normally take to ship this product, such as: 'Usually ships in 24 hours.' >= 0 characters and <= 255 characters",
    optional: true,
  },
  gift_wrapping_options_type: {
    type: "string",
    label: "Gift wrapping options type",
    description:
        "Type of gift-wrapping options. Values: any - allow any gift-wrapping options in the store; none - disallow gift-wrapping on the product; list – provide a list of IDs in the gift_wrapping_options_list field. Allowed values: any, none or list",
    optional: true,
    options: [
      "any",
      "none",
      "list",
    ],
  },
  gift_wrapping_options_list: {
    type: "string[]",
    label: "Gift wrapping options list",
    description: "A list of gift-wrapping option IDs.",
    optional: true,
  },
  sort_order: {
    type: "integer",
    label: "Sort order",
    description:
        "Priority to give this product when included in product lists on category pages and in search results. Lower integers will place the product closer to the top of the results. >= -2147483648 and <= 2147483647",
    optional: true,
  },
  condition: {
    type: "string",
    label: "Condition",
    description:
        "The product condition. Will be shown on the product page if the is_condition_shown field's value is true. Possible values: New, Used, Refurbished. Allowed values: New, Used and Refurbished",
    optional: true,
    options: [
      "New",
      "Used",
      "Refurbished",
    ],
  },
  is_condition_shown: {
    type: "boolean",
    label: "Is condition shown",
    description:
        "Flag used to determine whether the product condition is shown to the customer on the product page.",
    optional: true,
  },
  order_quantity_minimum: {
    type: "integer",
    label: "Order quantity minimum",
    description:
        "The minimum quantity an order must contain, to be eligible to purchase this product. >= 0 and <= 1000000000",
    optional: true,
  },
  order_quantity_maximum: {
    type: "integer",
    label: "Order quantity maximum",
    description:
        "The maximum quantity an order can contain when purchasing the product. >= 0 and <= 1000000000",
    optional: true,
  },
  page_title: {
    type: "string",
    label: "Page title",
    description:
        "Custom title for the product page. If not defined, the product name will be used as the meta title. >= 0 characters and <= 255 characters",
    optional: true,
  },
  meta_keywords: {
    type: "string[]",
    label: "Meta keywords",
    description:
        "Custom meta keywords for the product page. If not defined, the store's default keywords will be used.",
    optional: true,
  },
  meta_description: {
    type: "string",
    label: "Meta description",
    description:
        "Custom meta description for the product page. If not defined, the store's default meta description will be used. >= 0 characters and <= 65535 characters",
    optional: true,
  },
  view_count: {
    type: "integer",
    label: "View count",
    description:
        "The number of times the product has been viewed. >= 0 and <= 1000000000",
    optional: true,
  },
  preorder_release_date: {
    type: "string",
    label: "Preorder release date",
    description:
        "Pre-order release date. See the availability field for details on setting a product's availability to accept pre-orders.",
    optional: true,
  },
  preorder_message: {
    type: "string",
    label: "Preorder message",
    description:
        "Custom expected-date message to display on the product page. If undefined, the message defaults to the storewide setting. Can contain the %%DATE%% placeholder, which will be substituted for the release date. >= 0 characters and <= 255 characters",
    optional: true,
  },
  is_preorder_only: {
    type: "boolean",
    label: "Is preorder only",
    description:
        "If set to true then on the preorder release date the preorder status will automatically be removed. If set to false, then on the release date the preorder status will not be removed. It will need to be changed manually either in the control panel or using the API. Using the API set availability to available.",
    optional: true,
  },
  is_price_hidden: {
    type: "boolean",
    label: "Is preorder hidden",
    description:
        "False by default, indicating that this product's price should be shown on the product page. If set to true, the price is hidden. (NOTE: To successfully set is_price_hidden to true, the availability value must be disabled.)",
    optional: true,
  },
  price_hidden_label: {
    type: "string",
    label: "Price hidden label",
    description:
        "By default, an empty string. If is_price_hidden is true, the value of price_hidden_label is displayed instead of the price. (NOTE: To successfully set a non-empty string value with is_price_hidden set to true, the availability value must be disabled.) >= 0 characters and <= 200 characters",
    optional: true,
  },
  open_graph_type: {
    type: "string",
    label: "Open graph type",
    description:
        "Type of product, defaults to product. Allowed values: product, album, book, drink, food, game, movie, song OR tv_show",
    optional: true,
    options: [
      "product",
      "album",
      "book",
      "drink",
      "food",
      "game",
      "movie",
      "song",
      "tv_show",
    ],
  },
  open_graph_title: {
    type: "string",
    label: "Open graph title",
    description:
        "Title of the product, if not specified the product name will be used instead.",
    optional: true,
  },
  open_graph_description: {
    type: "string",
    label: "Open graph description",
    description:
        "Description to use for the product, if not specified then the meta_description will be used instead.",
    optional: true,
  },
  open_graph_use_meta_description: {
    type: "boolean",
    label: "Open graph use meta description",
    description:
        "Flag to determine if product description or open graph description is used.",
    optional: true,
  },
  open_graph_use_product_name: {
    type: "boolean",
    label: "Open graph use product name",
    description:
        "Flag to determine if product name or open graph name is used.",
    optional: true,
  },
  open_graph_use_image: {
    type: "boolean",
    label: "Open graph use image",
    description:
        "Flag to determine if product image or open graph image is used.",
    optional: true,
  },
  brand_name: {
    type: "string",
    label: "Brand name",
    description:
        "It performs a fuzzy match and adds the brand. eg. \"Common Good\" and \"Common good\" are the same. Brand name does not return as part of a product response. Only the brand_id.",
    optional: true,
  },
  gtin: {
    type: "string",
    label: "GTIN",
    description: "Global Trade Item Number",
    optional: true,
  },
  mpn: {
    type: "string",
    label: "MPN",
    description: "Manufacturer Part Number",
    optional: true,
  },
  reviews_rating_sum: {
    type: "any",
    label: "Reviews rating sum",
    description: "The total rating for the product.",
    optional: true,
  },
  reviews_count: {
    type: "integer",
    label: "Reviews count",
    description: "The number of times the product has been rated.",
    optional: true,
  },
  total_sold: {
    type: "integer",
    label: "Total sold",
    description: "The total quantity of this product sold.",
    optional: true,
  },
};

export default PROPS;

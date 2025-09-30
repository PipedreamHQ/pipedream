import sellercloud from "../../sellercloud.app.mjs";

export default {
  key: "sellercloud-create-product",
  name: "Create Product",
  description: "Creates a new product. [See the documentation](https://developer.sellercloud.com/dev-article/create-product/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sellercloud,
    company: {
      propDefinition: [
        sellercloud,
        "company",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new product",
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "SKU of the new product",
    },
    productType: {
      propDefinition: [
        sellercloud,
        "productType",
      ],
    },
    purchaser: {
      propDefinition: [
        sellercloud,
        "purchaser",
      ],
    },
    siteCost: {
      type: "string",
      label: "Site Cost",
      description: "The site cost of the new product. Required if client setting ‘Require SiteCost and Buyer/Purchaser while creating product’ is enabled.",
      optional: true,
    },
    defaultPrice: {
      type: "string",
      label: "Default Price",
      description: "The default price of the new product. Required if client setting ‘Require SiteCost and Buyer/Purchaser while creating product’ and ‘Require SiteCost and Buyer/Purchaser while creating product’ are enabled.",
      optional: true,
    },
    manufacturer: {
      propDefinition: [
        sellercloud,
        "manufacturer",
        (c) => ({
          companyId: c.company,
        }),
      ],
    },
    autoaAssignUpc: {
      type: "boolean",
      label: "Auto Assign UPC",
      description: "Whether the new product should have Auto Assign UPC",
      optional: true,
    },
    productNotes: {
      type: "string",
      label: "Product Notes",
      description: "Notes for the new product",
      optional: true,
    },
    upc: {
      type: "string",
      label: "UPC",
      description: "Product UPC",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      CompanyId: this.company,
      ProductName: this.name,
      ProductSKU: this.sku,
      ProductTypeName: this.productType,
      PurchaserId: this.purchaser,
      SiteCost: this.siteCost,
      DefaultPrice: this.defaultPrice,
      ManufacturerId: this.manufacturer,
      AutoAssignUPC: this.autoAssignUpc,
      ProductNotes: this.productNotes,
      UPC: this.upc,
    };

    const response = await this.sellercloud.createProduct({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created product with ID ${response}`);
    }

    return response;
  },
};

import fortnox from "../../fortnox.app.mjs";

export default {
  key: "fortnox-create-article",
  name: "Create Article",
  description: "Creates a new article in the Fortnox API. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Articles/operation/1_create_3).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    fortnox,
    description: {
      propDefinition: [
        fortnox,
        "articleDescription",
      ],
    },
    ean: {
      propDefinition: [
        fortnox,
        "ean",
      ],
    },
    directCost: {
      propDefinition: [
        fortnox,
        "directCost",
      ],
    },
    freightCost: {
      propDefinition: [
        fortnox,
        "freightCost",
      ],
    },
    purchasePrice: {
      propDefinition: [
        fortnox,
        "purchasePrice",
      ],
    },
    salesPrice: {
      propDefinition: [
        fortnox,
        "salesPrice",
      ],
    },
    manufacturer: {
      propDefinition: [
        fortnox,
        "manufacturer",
      ],
    },
    quantityInStock: {
      propDefinition: [
        fortnox,
        "quantityInStock",
      ],
    },
    supplierNumber: {
      propDefinition: [
        fortnox,
        "supplierNumber",
      ],
    },
    type: {
      propDefinition: [
        fortnox,
        "articleType",
      ],
    },
    vat: {
      propDefinition: [
        fortnox,
        "articleVat",
      ],
    },
    weight: {
      propDefinition: [
        fortnox,
        "weight",
      ],
    },
    width: {
      propDefinition: [
        fortnox,
        "width",
      ],
    },
    height: {
      propDefinition: [
        fortnox,
        "height",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fortnox.createArticle({
      $,
      data: {
        Article: {
          Description: this.description,
          EAN: this.ean,
          DirectCost: this.directCost
            ? +this.directCost
            : undefined,
          FreightCost: this.freightCost
            ? +this.freightCost
            : undefined,
          PurchasePrice: this.purchasePrice
            ? +this.purchasePrice
            : undefined,
          SalesPrice: this.salesPrice
            ? +this.salesPrice
            : undefined,
          Manufacturer: this.manufacturer,
          QuantityInStock: this.quantityInStock
            ? +this.quantityInStock
            : undefined,
          SupplierNumber: this.supplierNumber,
          Type: this.type,
          VAT: this.vat,
          Weight: this.weight
            ? +this.weight
            : undefined,
          Width: this.width
            ? +this.width
            : undefined,
          Height: this.height
            ? +this.height
            : undefined,
        },
      },
    });
    $.export("$summary", `Successfully created article with ID \`${response.Article.ArticleNumber}\``);
    return response;
  },
};

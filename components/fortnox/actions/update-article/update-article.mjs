import fortnox from "../../fortnox.app.mjs";

export default {
  key: "fortnox-update-article",
  name: "Update Article",
  description: "Updates an existing article in the Fortnox API. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Articles/operation/1_update_2).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    fortnox,
    articleNumber: {
      propDefinition: [
        fortnox,
        "articleNumber",
      ],
    },
    description: {
      propDefinition: [
        fortnox,
        "articleDescription",
      ],
      optional: true,
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
    const { Article: article } = await this.fortnox.getArticle({
      $,
      articleNumber: this.articleNumber,
    });

    const response = await this.fortnox.updateArticle({
      $,
      articleNumber: this.articleNumber,
      data: {
        Article: {
          Description: this.description || article.Description,
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
    $.export("$summary", `Successfully updated article with ID \`${response.Article.ArticleNumber}\``);
    return response;
  },
};

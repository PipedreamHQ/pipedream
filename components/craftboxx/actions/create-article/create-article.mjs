import app from "../../craftboxx.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "craftboxx-create-article",
  name: "Create Article",
  description: "Creates a new article in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the article",
    },
    manufacturer: {
      type: "string",
      label: "Manufacturer",
      description: "The manufacturer of the article",
      optional: true,
    },
    manufacturerArticleNr: {
      type: "string",
      label: "Manufacturer Article Number",
      description: "The manufacturer article number of the article",
      optional: true,
    },
    ean: {
      type: "string",
      label: "EAN",
      description: "The EAN of the article",
      optional: true,
    },
    supplierArticleNr: {
      type: "string",
      label: "Supplier Article Number",
      description: "The supplier article number of the article",
      optional: true,
    },
    unitPrice: {
      type: "string",
      label: "Unit Price",
      description: "The price of the article. Eg. `2.5`",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency of the article",
      optional: true,
      options: constants.CURRENCIES,
    },
    vatRate: {
      type: "string",
      label: "VAT Rate",
      description: "The VAT rate of the article. Eg. `19`",
      optional: true,
    },
    vatIncluded: {
      type: "boolean",
      label: "VAT Included",
      description: "Whether the price is VAT included",
      optional: true,
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "The unit of the article",
      optional: true,
      options: constants.UNITS,
    },
    priceDate: {
      type: "string",
      label: "Price Date",
      description: "The date of the price. Eg. `2024-04-21`",
      optional: true,
    },
    articleUrl: {
      type: "string",
      label: "Article URL",
      description: "The URL of the article",
      optional: true,
    },
    info: {
      type: "string",
      label: "Info",
      description: "The description of the article",
      optional: true,
    },
    dangerousMaterial: {
      type: "boolean",
      label: "Dangerous Material",
      description: "Whether the article is dangerous material",
      optional: true,
    },
  },
  methods: {
    createArticle(args = {}) {
      return this.app.post({
        path: "/articles",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createArticle,
      ...data
    } = this;

    const response = await createArticle({
      $,
      data: utils.keysToSnakeCase(data),
    });

    $.export("$summary", `Successfully created article with ID \`${response.data.id}\``);
    return response;
  },
};

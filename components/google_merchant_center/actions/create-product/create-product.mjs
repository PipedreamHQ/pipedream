import { ConfigurationError } from "@pipedream/platform";
import { LANGUAGE_OPTIONS } from "../../common/constants.mjs";
import {
  buildProductInputBody, parseObjectValues,
} from "../../common/utils.mjs";
import googleMerchant from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-create-product",
  name: "Create Product",
  description: "Creates a product in your Google Merchant Center account. If a product with the same Offer ID, Content Language and Feed Label already exists in the data source, it is replaced. [See the documentation](https://developers.google.com/merchant/api/reference/rest/products_v1/accounts.productInputs/insert)",
  version: "1.0.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleMerchant,
    offerId: {
      type: "string",
      label: "Offer ID",
      description: "Your unique identifier for the product, e.g. `sku123`. Leading and trailing whitespaces are stripped and multiple whitespaces are replaced by a single whitespace upon submission. See the [products data specification](https://support.google.com/merchants/answer/188494#id) for details.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Your product's name, e.g. `Classic Cotton T-Shirt` (max 150 chars)",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Your product's description, e.g. `A comfortable t-shirt made from 100% cotton.` (max 5000 chars)",
      optional: true,
    },
    contentLanguage: {
      type: "string",
      label: "Content Language",
      description: "The [two-letter ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for the product, e.g. `en`",
      options: LANGUAGE_OPTIONS,
    },
    feedLabel: {
      type: "string",
      label: "Feed Label",
      description: "A label to categorize and identify your products, typically the country of sale, e.g. `US`. Supports A-Z, 0-9, hyphen and underscore, no spaces (max 20 chars). See [Using feed labels](https://support.google.com/merchants/answer/14994087).",
    },
    legacyLocal: {
      type: "boolean",
      label: "Legacy Local",
      description: "Set to `true` if the product only targets local destinations. Cannot be changed after creation.",
      optional: true,
    },
    dataSourceId: {
      propDefinition: [
        googleMerchant,
        "dataSourceId",
      ],
      description: "The ID or full resource name of an API primary product data source, e.g. `104628` or `accounts/123456/dataSources/104628`. Use **List Data Sources** to find valid values. If omitted, the account's only API primary product data source is used.",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional product attributes, e.g. `{ \"link\": \"https://www.example.com/p/sku123\", \"availability\": \"IN_STOCK\", \"price\": { \"amountMicros\": \"9990000\", \"currencyCode\": \"USD\" } }`. Values that are JSON objects or arrays are parsed. Use the `customAttributes` key to submit custom attributes. [See the documentation](https://developers.google.com/merchant/api/reference/rest/products_v1/ProductAttributes)",
      optional: true,
    },
  },
  methods: {
    async getDataSource($) {
      if (this.dataSourceId) {
        return this.googleMerchant.dataSourceName(this.dataSourceId);
      }
      const dataSources = await this.googleMerchant.listApiPrimaryDataSources({
        $,
      });
      if (dataSources.length !== 1) {
        throw new ConfigurationError(`Found ${dataSources.length} API primary product data sources. Please set **Data Source ID**; use **List Data Sources** to find it.`);
      }
      return dataSources[0].name;
    },
  },
  async run({ $ }) {
    const dataSource = await this.getDataSource($);
    const body = buildProductInputBody({
      title: this.title,
      description: this.description,
      ...parseObjectValues(this.additionalOptions),
    });

    const response = await this.googleMerchant.createProduct({
      $,
      dataSource,
      data: {
        offerId: this.offerId,
        contentLanguage: this.contentLanguage,
        feedLabel: this.feedLabel,
        legacyLocal: this.legacyLocal,
        ...body,
      },
    });
    $.export("$summary", `Successfully created product ${response.name}`);
    return response;
  },
};

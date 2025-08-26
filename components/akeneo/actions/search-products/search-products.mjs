import akeneo from "../../akeneo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "akeneo-search-products",
  name: "Search Products",
  description: "Search products from Akeneo. [See the documentation](https://api.akeneo.com/api-reference.html#get_products)",
  version: "0.0.1",
  type: "action",
  props: {
    akeneo,
    search: {
      type: "string",
      label: "Search",
      description: "Filter products, for more details see the [Filters](https://api.akeneo.com/documentation/filter.html) section",
      optional: true,
    },
    scope: {
      propDefinition: [
        akeneo,
        "channelCode",
      ],
      label: "Scope",
      description: "Filter product values to return scopable attributes for the given channel as well as the non localizable/non scopable attributes, for more details see the [Filter product values via channel](https://api.akeneo.com/documentation/filter.html#via-channel) section",
      optional: true,
    },
    locales: {
      propDefinition: [
        akeneo,
        "locale",
      ],
      description: "Filter product values to return localizable attributes for the given locales as well as the non localizable/non scopable attributes, for more details see the [Filter product values via locale](https://api.akeneo.com/documentation/filter.html#via-locale) section",
      optional: true,
    },
    attributes: {
      propDefinition: [
        akeneo,
        "attribute",
      ],
      label: "Attributes",
      description: "Filter product values to only return those concerning the given attributes, for more details see the [Filter on product values](https://api.akeneo.com/documentation/filter.html#filter-product-values) section",
      optional: true,
    },
    convertMeasurements: {
      type: "boolean",
      label: "Convert Measurements",
      description: "Convert values of measurement attributes to the unit configured in the channel provided by the parameter \"scope\". Therefore, this parameter requires the \"scope\" parameter to be provided.",
      optional: true,
    },
    withCount: {
      type: "boolean",
      label: "With Count",
      description: "Return the count of items in the response. Be careful: on large catalogs, enabling counts can significantly impact performance.",
      optional: true,
    },
    withAttributeOptions: {
      propDefinition: [
        akeneo,
        "withAttributeOptions",
      ],
    },
    withAssetShareLinks: {
      propDefinition: [
        akeneo,
        "withAssetShareLinks",
      ],
    },
    withQualityScores: {
      propDefinition: [
        akeneo,
        "withQualityScores",
      ],
    },
    withCompletenesses: {
      propDefinition: [
        akeneo,
        "withCompletenesses",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of items to return per page",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.convertMeasurements && !this.scope) {
      throw new ConfigurationError("The `convertMeasurements` parameter requires the `scope` parameter to be provided");
    }

    const response = await this.akeneo.getProducts({
      $,
      params: {
        search: this.search,
        scope: this.scope,
        locales: this.locales,
        attributes: this.attributes,
        convert_measurements: this.convertMeasurements,
        with_count: this.withCount,
        with_attribute_options: this.withAttributeOptions,
        with_asset_share_links: this.withAssetShareLinks,
        with_quality_scores: this.withQualityScores,
        with_completenesses: this.withCompletenesses,
        page: this.page,
        limit: this.limit,
      },
    });

    $.export("$summary", `Found ${response._embedded.items.length} products`);
    return response;
  },
};

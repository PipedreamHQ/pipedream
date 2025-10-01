import axesso from "../../axesso_data_service.app.mjs";

export default {
  key: "axesso_data_service-list-reviews",
  name: "List Reviews",
  description: "Lists reviews for an Amazon product using Axesso Data Service. [See the documentation](https://axesso.developer.azure-api.net/api-details#api=axesso-amazon-data-service&operation=reviews)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    axesso,
    url: {
      propDefinition: [
        axesso,
        "url",
      ],
    },
    domainCode: {
      propDefinition: [
        axesso,
        "domainCode",
      ],
    },
    sortBy: {
      propDefinition: [
        axesso,
        "sortBy",
      ],
    },
    maxResults: {
      propDefinition: [
        axesso,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const { asin } = await this.axesso.getProductDetails({
      $,
      params: {
        url: this.url,
        psc: 1,
      },
    });

    const results = await this.axesso.paginate({
      fn: this.axesso.lookupReviews,
      args: {
        $,
        params: {
          asin,
          domainCode: this.domainCode,
          sortBy: this.sortBy,
        },
      },
      resourceKey: "reviews",
      max: this.maxResults,
    });

    const reviews = [];
    for await (const review of results) {
      reviews.push(review);
    }

    $.export("$summary", `Fetched reviews for product with ASIN: ${asin}`);
    return reviews;
  },
};

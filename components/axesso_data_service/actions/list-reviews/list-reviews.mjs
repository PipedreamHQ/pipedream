import axessoDataService from "../../axesso_data_service.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "axesso_data_service-list-reviews",
  name: "List Reviews",
  description: "Lists reviews for a product using Axesso Data Service. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    axessoDataService,
    domainCode: {
      propDefinition: [
        axessoDataService,
        "domainCode",
      ],
    },
    asin: {
      propDefinition: [
        axessoDataService,
        "asin",
      ],
    },
    sortBy: {
      propDefinition: [
        axessoDataService,
        "sortBy",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const reviews = await this.axessoDataService.lookupReviews({
      domainCode: this.domainCode,
      asin: this.asin,
      sortBy: this.sortBy,
    });
    $.export("$summary", `Fetched reviews for ASIN: ${this.asin}`);
    return reviews;
  },
};

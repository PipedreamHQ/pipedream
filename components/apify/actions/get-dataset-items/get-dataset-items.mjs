import apify from "../../apify.app.mjs";
import { LIMIT } from "../../common/constants.mjs";

export default {
  key: "apify-get-dataset-items",
  name: "Get Dataset Items",
  description: "Returns data stored in a dataset. [See the documentation](https://docs.apify.com/api/v2/dataset-items-get)",
  version: "0.0.3",
  type: "action",
  props: {
    apify,
    datasetId: {
      propDefinition: [
        apify,
        "datasetId",
      ],
    },
    clean: {
      propDefinition: [
        apify,
        "clean",
      ],
    },
    fields: {
      propDefinition: [
        apify,
        "fields",
      ],
    },
    omit: {
      propDefinition: [
        apify,
        "omit",
      ],
    },
    flatten: {
      propDefinition: [
        apify,
        "flatten",
      ],
    },
    maxResults: {
      propDefinition: [
        apify,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      limit: LIMIT,
      offset: 0,
      clean: this.clean,
      fields: this.fields && this.fields.join(),
      omit: this.omit && this.omit.join(),
      flatten: this.flatten && this.flatten.join(),
    };

    const results = [];
    let total;

    do {
      const items = await this.apify.listDatasetItems({
        $,
        datasetId: this.datasetId,
        params,
      });
      results.push(...items);
      if (results.length >= this.maxResults) {
        break;
      }
      total = items?.length;
      params.offset += LIMIT;
    } while (total);

    if (results.length > this.maxResults) {
      results.length = this.maxResults;
    }

    if (results.length > 0) {
      $.export("$summary", `Successfully retrieved ${results.length} item${results.length === 1
        ? ""
        : "s"}`);
    }
    return results;
  },
};

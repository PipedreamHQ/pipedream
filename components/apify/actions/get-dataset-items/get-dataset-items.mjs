import apify from "../../apify.app.mjs";
import { LIMIT } from "../../common/constants.mjs";

export default {
  key: "apify-get-dataset-items",
  name: "Get Dataset Items",
  description: "Returns data stored in a dataset. [See the documentation](https://docs.apify.com/api/v2/dataset-items-get)",
  version: "0.0.6",
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
    offset: {
      propDefinition: [
        apify,
        "offset",
      ],
    },
    limit: {
      propDefinition: [
        apify,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      limit: LIMIT,
      offset: this.offset,
      clean: this.clean,
      fields: this.fields,
      omit: this.omit,
    };

    const results = [];
    let total;

    do {
      const { items } = await this.apify.listDatasetItems({
        datasetId: this.datasetId,
        params,
      });
      results.push(...items);
      if (results.length >= this.limit) {
        break;
      }
      total = items?.length;
      params.offset += LIMIT;
    } while (total);

    if (results.length > this.limit) {
      results.length = this.limit;
    }

    if (results.length > 0) {
      $.export("$summary", `Successfully retrieved ${results.length} item${results.length === 1
        ? ""
        : "s"}`);
    }
    return results;
  },
};

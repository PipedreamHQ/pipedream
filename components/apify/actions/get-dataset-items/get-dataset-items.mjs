import apify from "../../apify.app.mjs";
import { LIMIT } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "apify-get-dataset-items",
  name: "Get dataset items",
  description: "Returns data stored in a dataset. [See the documentation](https://docs.apify.com/api/v2/dataset-items-get)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const {
      clean, fields, omit, limit,
    } = this;
    const datasetId = this.datasetId?.replace("/", "~");
    const offset = this.offset ?? 0;

    if (limit !== undefined && limit < 1) {
      throw new ConfigurationError("Limit must be 1 or greater.");
    }
    if (offset < 0) {
      throw new ConfigurationError("Offset must be 0 or greater.");
    }

    const results = [];
    let currentOffset = offset;

    while (limit === undefined || results.length < limit) {
      const pageSize = limit === undefined
        ? LIMIT
        : Math.min(LIMIT, limit - results.length);
      const { items } = await this.apify.listDatasetItems({
        datasetId,
        params: {
          offset: currentOffset,
          limit: pageSize,
          clean,
          fields,
          omit,
        },
      });
      if (!items?.length) {
        break;
      }
      results.push(...items);
      currentOffset += items.length;
      if (items.length < pageSize) {
        break;
      }
    }

    if (results.length > 0) {
      $.export("$summary", `Successfully retrieved ${results.length} item${results.length === 1
        ? ""
        : "s"}`);
    }
    return results;
  },
};

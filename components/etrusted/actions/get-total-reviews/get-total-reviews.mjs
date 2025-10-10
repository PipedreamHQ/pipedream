import { parseObject } from "../../common/utils.mjs";
import etrusted from "../../etrusted.app.mjs";

export default {
  key: "etrusted-get-total-reviews",
  name: "Get The Total Number Of Reviews Based On A Filter",
  description: "Retrieves count of reviews for a specific channel. [See the documentation](https://developers.etrusted.com/reference/getreviewscount)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    etrusted,
    channelId: {
      propDefinition: [
        etrusted,
        "channelId",
      ],
      type: "string[]",
      optional: true,
    },
    submittedAfter: {
      propDefinition: [
        etrusted,
        "submittedAfter",
      ],
      optional: true,
    },
    submittedBefore: {
      propDefinition: [
        etrusted,
        "submittedBefore",
      ],
      optional: true,
    },
    rating: {
      propDefinition: [
        etrusted,
        "rating",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        etrusted,
        "status",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        etrusted,
        "type",
      ],
      optional: true,
    },
    hasReply: {
      propDefinition: [
        etrusted,
        "hasReply",
      ],
      optional: true,
    },
    ignoreStatements: {
      propDefinition: [
        etrusted,
        "ignoreStatements",
      ],
      optional: true,
    },
    query: {
      propDefinition: [
        etrusted,
        "query",
      ],
      optional: true,
    },
    sku: {
      propDefinition: [
        etrusted,
        "sku",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.etrusted.getTotalReviews({
      $,
      params: {
        channels: parseObject(this.channelId)?.join(","),
        submittedAfter: this.submittedAfter,
        submittedBefore: this.submittedBefore,
        rating: parseObject(this.rating)?.join(","),
        status: parseObject(this.status)?.join(","),
        type: parseObject(this.type)?.join(","),
        hasReply: this.hasReply,
        ignoreStatements: this.ignoreStatements,
        query: this.query,
        sku: parseObject(this.sku)?.join(","),
      },
    });

    $.export("$summary", `Successfully retrieved total number of reviews: ${response.totalElements}`);
    return response;
  },
};

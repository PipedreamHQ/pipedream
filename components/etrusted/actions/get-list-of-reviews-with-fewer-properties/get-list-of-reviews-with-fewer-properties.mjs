import { parseObject } from "../../common/utils.mjs";
import etrusted from "../../etrusted.app.mjs";

export default {
  key: "etrusted-get-list-of-reviews-with-fewer-properties",
  name: "Get List of Reviews with Fewer Properties",
  description: "Retrieves a list of reviews with fewer properties. [See the documentation](https://developers.etrusted.com/reference/getminimalreviews)",
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
    after: {
      propDefinition: [
        etrusted,
        "reviewId",
      ],
      label: "After",
      description: "`After` is a review ID. The list of reviews in the response will only contain reviews submitted earlier than the review with this ID.",
      optional: true,
    },
    before: {
      propDefinition: [
        etrusted,
        "reviewId",
      ],
      label: "Before",
      description: "`Before` is a review ID. The list of reviews in the response will only contain reviews submitted later than the review with this ID.",
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
    orderBy: {
      propDefinition: [
        etrusted,
        "orderBy",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        etrusted,
        "maxResults",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.etrusted.paginate({
      $,
      fn: this.etrusted.getListOfReviewsWithFewerProperties,
      params: {
        channels: this.channelId && parseObject(this.channelId).join(","),
        after: this.after,
        before: this.before,
        submittedAfter: this.submittedAfter,
        submittedBefore: this.submittedBefore,
        rating: this.rating && parseObject(this.rating).join(","),
        status: this.status && parseObject(this.status).join(","),
        type: this.type && parseObject(this.type).join(","),
        hasReply: this.hasReply,
        ignoreStatements: this.ignoreStatements,
        query: this.query,
        sku: this.sku,
        orderBy: this.orderBy,
        maxResults: this.maxResults,
      },
      maxResults: this.maxResults,
    });

    const reviews = [];
    for await (const review of response) {
      reviews.push(review);
    }

    $.export("$summary", `Successfully retrieved ${reviews.length} review${reviews.length === 1
      ? ""
      : "s"} with fewer properties`);
    return reviews;
  },
};

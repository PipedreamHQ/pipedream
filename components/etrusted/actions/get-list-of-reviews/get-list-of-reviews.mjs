import { parseObject } from "../../common/utils.mjs";
import etrusted from "../../etrusted.app.mjs";

export default {
  key: "etrusted-get-list-of-reviews",
  name: "Get List of Reviews",
  description: "Get a list of reviews for a specific channel, a set of channels or for your entire account. [See the documentation](https://developers.etrusted.com/reference/getreviews)",
  version: "0.0.1",
  type: "action",
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
    additionalInformation: {
      type: "string[]",
      label: "Additional Information",
      description: "A list of additional pieces of information to be retrieved with the review. If this property is not set, none of the of additional information are included in the review.",
      options: [
        "VETO",
        "ATTACHMENTS",
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
    const response = this.etrusted.paginate({
      $,
      fn: this.etrusted.getListOfReviews,
      params: {
        channels: parseObject(this.channelId)?.join(","),
        after: this.after,
        before: this.before,
        submittedAfter: this.submittedAfter,
        submittedBefore: this.submittedBefore,
        rating: parseObject(this.rating)?.join(","),
        status: parseObject(this.status)?.join(","),
        type: parseObject(this.type)?.join(","),
        hasReply: this.hasReply,
        additionalInformation: parseObject(this.additionalInformation)?.join(","),
        ignoreStatements: this.ignoreStatements,
        query: this.query,
        sku: parseObject(this.sku)?.join(","),
        orderBy: this.orderBy,
      },
      maxResults: this.maxResults,
    });

    const reviews = [];
    for await (const review of response) {
      reviews.push(review);
    }

    $.export("$summary", `Successfully retrieved ${reviews.length} review${reviews.length === 1
      ? ""
      : "s"}`);
    return reviews;
  },
};

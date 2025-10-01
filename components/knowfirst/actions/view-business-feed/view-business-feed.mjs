import knowfirst from "../../knowfirst.app.mjs";

export default {
  key: "knowfirst-view-business-feed",
  name: "View Business Feed",
  description: "Retrieve feed event history for a business. [See the documentation](https://www.knowfirst.ai/docs/api/#/Feed/FeedList)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    knowfirst,
    businessId: {
      propDefinition: [
        knowfirst,
        "businessId",
      ],
    },
    before: {
      type: "string",
      label: "Before",
      description: "Filter to events before a certain time. Enter time in ISO 8601 format. Example: `2022-06-24T03:13:23Z`",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "Filter to events after a certain time. Enter time in ISO 8601 format. Example: `2022-06-24T03:13:23Z`",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. Defaults to `100`.",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const results = this.knowfirst.paginate({
      $,
      resourceFn: this.knowfirst.getFeed,
      params: {
        "business_id": this.businessId,
        "time[lt]": this.before,
        "time[gt]": this.after,
      },
      max: this.maxResults,
    });

    const items = [];
    for await (const item of results) {
      items.push(item);
    }

    $.export("$summary", `Successfully retrieved ${items.length} feed item${items.length === 1
      ? ""
      : "s"}`);

    return items;
  },
};

import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-status-pages",
  name: "List Status Pages",
  description:
    "List configured PagerDuty status pages."
    + " Use status page IDs with **List Status Page Posts** to retrieve posts on a specific page."
    + " Requires Business+ plan — accounts without this plan will receive empty results or a 402 error."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/cc01037564658-list-status-pages)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return (1–100). Default: 25.",
      optional: true,
      default: 25,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Pagination offset. Default: 0.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const response = await this.app.listStatusPages({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Found ${response.status_pages?.length ?? 0} status pages`);
    return response;
  },
};

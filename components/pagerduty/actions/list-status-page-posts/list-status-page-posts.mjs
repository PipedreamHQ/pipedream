import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-status-page-posts",
  name: "List Status Page Posts",
  description:
    "List posts on a PagerDuty status page."
    + " Use **List Status Pages** to discover status page IDs."
    + " Set `activeOnly: true` to filter to currently active posts (client-side filter)."
    + " Requires Business+ plan — accounts without this plan will receive empty results or a 402 error."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/a2b54c12938bd-list-posts-for-a-status-page)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    statusPageId: {
      type: "string",
      label: "Status Page ID",
      description: "The ID of the status page. Use **List Status Pages** to discover IDs.",
    },
    activeOnly: {
      type: "boolean",
      label: "Active Only",
      description: "When `true`, filters results to currently active posts (client-side filter).",
      optional: true,
    },
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
    const response = await this.app.listStatusPagePosts({
      $,
      statusPageId: this.statusPageId,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });

    let posts = response.posts ?? response.status_page_posts ?? [];
    if (this.activeOnly) {
      posts = posts.filter((p) => p.status === "active" || !p.resolved_at);
    }

    $.export("$summary", `Found ${posts.length} posts on status page ${this.statusPageId}`);
    return {
      ...response,
      posts,
      status_page_posts: posts,
    };
  },
};

// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-list-posts",
  name: "List Posts",
  description:
    "List posts (newsletter issues) for a publication."
    + " Filter by status, audience, platform, or content tags."
    + " Returns post titles, dates, status, and URLs."
    + " Use **Get Publication Info** to get the publication ID."
    + " Use **Get Post Analytics** for aggregate performance"
    + " metrics across posts."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "posts/index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    publicationId: {
      type: "string",
      label: "Publication ID",
      description:
        "The publication ID. Use **Get Publication Info** to find"
        + " this.",
    },
    status: {
      type: "string",
      label: "Status",
      description:
        "Filter by post status. Options: `draft`, `confirmed`,"
        + " `archived`, `all`. Default returns all.",
      optional: true,
      options: [
        "draft",
        "confirmed",
        "archived",
        "all",
      ],
    },
    audience: {
      type: "string",
      label: "Audience",
      description:
        "Filter by audience. Options: `free`, `premium`, `all`.",
      optional: true,
      options: [
        "free",
        "premium",
        "all",
      ],
    },
    platform: {
      type: "string",
      label: "Platform",
      description:
        "Filter by platform. Options: `web`, `email`, `both`,"
        + " `all`.",
      optional: true,
      options: [
        "web",
        "email",
        "both",
        "all",
      ],
    },
    contentTags: {
      type: "string[]",
      label: "Content Tags",
      description: "Filter by content tags.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results per page. Default: 10.",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description:
        "Pagination cursor from a previous response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params: Record<string, unknown> = {};
    if (this.status) params.status = this.status;
    if (this.audience) params.audience = this.audience;
    if (this.platform) params.platform = this.platform;
    if (this.contentTags?.length) {
      params["content_tags[]"] = this.contentTags;
    }
    if (this.limit) params.limit = this.limit;
    if (this.cursor) params.cursor = this.cursor;

    const response = await this.app.listPosts(
      $,
      this.publicationId,
      params,
    );

    const posts = response.data || [];
    const total = response.total_results || posts.length;

    $.export(
      "$summary",
      `Found ${total} post${total === 1
        ? ""
        : "s"}, returning ${posts.length}`,
    );

    return response;
  },
});

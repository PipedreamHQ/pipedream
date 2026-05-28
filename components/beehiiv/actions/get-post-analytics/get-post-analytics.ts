// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-get-post-analytics",
  name: "Get Post Analytics",
  description:
    "Get aggregated analytics across all posts — open rates,"
    + " click rates, unsubscribes, etc."
    + " Filter by audience (free/premium), platform (web/email),"
    + " or content tags."
    + " Returns metrics: recipients, delivered, opens,"
    + " unique_opens, open_rate, clicks, unique_clicks,"
    + " click_rate, unsubscribes, spam_reports."
    + " Use **List Posts** to see individual post details."
    + " Use **Get Publication Info** to get the publication ID."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "posts/aggregate-stats)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
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
      description: "Filter analytics by content tags.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params: Record<string, unknown> = {};
    if (this.audience) params.audience = this.audience;
    if (this.platform) params.platform = this.platform;
    if (this.contentTags?.length) {
      params["content_tags[]"] = this.contentTags;
    }

    const response = await this.app.getAggregateStats(
      $,
      this.publicationId,
      params,
    );

    $.export(
      "$summary",
      "Retrieved aggregate post analytics",
    );

    return response;
  },
});

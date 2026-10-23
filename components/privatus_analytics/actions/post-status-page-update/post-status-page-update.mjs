import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-post-status-page-update",
  name: "Post Status Page Update",
  description: "Publishes an incident update on a status page and, by default, emails the subscribers of the page. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  props: {
    app,
    statusPageId: {
      propDefinition: [
        app,
        "statusPageId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Headline of the update, max 200 characters.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "Update text, plain text, max 10,000 characters.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "investigating, identified, monitoring or resolved.",
      options: [
        "investigating",
        "identified",
        "monitoring",
        "resolved",
      ],
      default: "investigating",
      optional: true,
    },
    postedAt: {
      type: "string",
      label: "Posted At",
      description: "When it happened, as an ISO 8601 time like `2026-10-02T14:30:00Z`. Defaults to now. Posts are sorted by this time.",
      optional: true,
    },
    notify: {
      type: "boolean",
      label: "Email Subscribers",
      description: "Email confirmed subscribers of a published page. Default true.",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/status_pages/${utils.segment(this.statusPageId)}/posts.json`,
      data: utils.compact({
        title: this.title,
        body: this.body,
        status: this.status,
        posted_at: this.postedAt,
        notify: this.notify,
      }),
    });
    $.export("$summary", `Successfully posted '${response.title}' on the status page`);
    return response;
  },
};

import app from "../../strava.app.mjs";

export default {
  key: "strava-get-activity-comments",
  name: "Get Activity Comments",
  description: "Return comments on a Strava activity."
    + " Use **Search Activities** first to resolve a name to an `activityId`."
    + " Use `pageSize` to control the per-page result count (Strava default and max apply). Empty array if no one has commented."
    + " Returns `{ comments, _rateLimitUsage }` — `_rateLimitUsage` exposes Strava's rate-limit headers for observability."
    + " [See the documentation](https://developers.strava.com/docs/reference/#api-Activities-getCommentsByActivityId)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    activityId: {
      propDefinition: [
        app,
        "activityId",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of comments per page (e.g., `30`). Optional — Strava's default and max apply.",
      optional: true,
    },
  },
  async run({ $ }) {
    // Use `!= null` so an explicit pageSize of 0 still passes through
    // (truthiness would silently drop it).
    const params = this.pageSize != null
      ? {
        page_size: this.pageSize,
      }
      : undefined;
    const {
      data: comments,
      _rateLimitUsage,
    } = await this.app.getActivityComments({
      $,
      activityId: this.activityId,
      params,
    });
    const count = Array.isArray(comments)
      ? comments.length
      : 0;
    $.export("$summary", `Retrieved ${count} comment${count === 1
      ? ""
      : "s"}`);
    return {
      comments: comments ?? [],
      _rateLimitUsage,
    };
  },
};

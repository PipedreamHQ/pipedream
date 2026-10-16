import app from "../../upload_post.app.mjs";

export default {
  key: "upload_post-list-scheduled-posts",
  name: "List Scheduled Posts",
  description: "List the posts scheduled for future publishing, ordered by scheduled date, with their `job_id`, platforms and content."
    + " Use the `job_id` with **Cancel Scheduled Post** or **Get Upload Status**. [See the documentation](https://docs.upload-post.com/api/schedule-posts)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    profileUsername: {
      propDefinition: [
        app,
        "user",
      ],
      description: "Only return the scheduled posts of this profile, e.g. `my_brand`. Use **List Profiles** to find it (the `username` field).",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "ISO-8601 lower bound on the scheduled date (inclusive), e.g. `2026-12-01T00:00:00Z`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "ISO-8601 upper bound on the scheduled date (exclusive), e.g. `2027-01-01T00:00:00Z`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Page size, e.g. `25`. Omit to return every matching post.",
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of posts to skip, ordered by scheduled date ascending, e.g. `25`. Defaults to `0`.",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listScheduledPosts({
      $,
      params: {
        profile_username: this.profileUsername,
        from: this.from,
        to: this.to,
        limit: this.limit,
        offset: this.offset,
      },
    });
    const count = response?.scheduled_posts?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} scheduled post${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

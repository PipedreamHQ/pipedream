import app from "../../letmepost.app.mjs";

const PLATFORMS = [
  "bluesky",
  "facebook",
  "instagram",
  "linkedin",
  "pinterest",
  "threads",
  "tiktok",
  "twitter",
];

const STATUSES = [
  "queued",
  "validated",
  "publishing",
  "published",
  "failed",
  "rejected",
  "canceled",
];

export default {
  key: "letmepost-list-posts",
  name: "List Posts",
  description: "List posts from the post log. [See the documentation](https://docs.letmepost.dev/api-reference/posts/list-posts-post-log)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    profileId: {
      propDefinition: [
        app,
        "profileId",
      ],
    },
    platform: {
      type: "string[]",
      label: "Platform",
      description: "Filter by one or more platforms.",
      optional: true,
      options: PLATFORMS,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter by one or more post lifecycle statuses.",
      optional: true,
      options: STATUSES,
    },
    errorCode: {
      type: "string[]",
      label: "Error Code",
      description: "Filter by one or more error codes (e.g. `preflight_failed`, `platform_rejected`).",
      optional: true,
    },
    q: {
      type: "string",
      label: "Search Query",
      description: "Case-insensitive substring match on the post body. Wildcard characters are matched literally.",
      optional: true,
    },
    after: {
      type: "string",
      label: "Created After",
      description: "ISO-8601 lower bound on `createdAt` (exclusive). Example: `2024-01-01T00:00:00Z`.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Created Before",
      description: "ISO-8601 upper bound on `createdAt` (exclusive). Example: `2024-12-31T23:59:59Z`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of posts to return (1–200).",
      optional: true,
      default: 50,
      min: 1,
      max: 200,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor from a previous list response. Pass `nextCursor` from the prior page to retrieve the next page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      profileId,
      platform,
      status,
      errorCode,
      q,
      after,
      before,
      limit,
      cursor,
    } = this;

    const response = await this.app.listPosts({
      $,
      params: {
        limit: limit ?? 50,
        profileId: profileId,
        platform: platform,
        status: status,
        errorCode: errorCode,
        q: q,
        after: after,
        before: before,
        cursor: cursor,
      },
    });

    const count = response.data?.length ?? 0;
    $.export(
      "$summary",
      `Successfully retrieved ${count} post(s)${response.nextCursor
        ? " (more available)"
        : ""}`,
    );

    return response;
  },
};

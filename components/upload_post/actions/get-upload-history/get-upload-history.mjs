import { ConfigurationError } from "@pipedream/platform";
import app from "../../upload_post.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "upload_post-get-upload-history",
  name: "Get Upload History",
  description: "Retrieve a paginated list of past uploads, most recent first, with one row per platform (success, post URL, error message) plus the uploads still in progress."
    + " Filter by profile, platform, status, date range or an exact `request_id` / `job_id` / `external_id` returned by **Upload Video**, **Upload Photos**, **Upload Text** or **List Scheduled Posts**."
    + " Use **Get Upload Status** to follow a single upload that is still running. [See the documentation](https://docs.upload-post.com/api/upload-history)",
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
      description: "Only return the uploads of this profile, e.g. `my_brand`. Use **List Profiles** to find it (the `username` field).",
      optional: true,
    },
    platform: {
      propDefinition: [
        app,
        "historyPlatform",
      ],
    },
    status: {
      propDefinition: [
        app,
        "uploadStatus",
      ],
    },
    requestId: {
      propDefinition: [
        app,
        "requestId",
      ],
      description: "Exact match on the `request_id` returned by **Upload Video**, **Upload Photos** or **Upload Text**, e.g. `req_123`. Returns every platform row of that request.",
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
      description: "Exact match on the `job_id` of a scheduled or async job, e.g. `a1b2c3d4e5f67890a1b2c3d4e5f67890`. Use **List Scheduled Posts** to find it (the `job_id` field).",
    },
    externalId: {
      propDefinition: [
        app,
        "externalId",
      ],
      description: "Exact match on the `external_id` you set when creating the post, e.g. `cms-post-8841`.",
    },
    start: {
      type: "string",
      label: "Start Date",
      description: "Start of the date range, `YYYY-MM-DD` or ISO 8601, e.g. `2026-09-01`. Requires `end`.",
      optional: true,
    },
    end: {
      type: "string",
      label: "End Date",
      description: "End of the date range, `YYYY-MM-DD` or ISO 8601, e.g. `2026-09-30`. Requires `start`; the range can span at most 2 months.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number, e.g. `2`. Defaults to `1`.",
      min: 1,
      optional: true,
      default: 1,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Page size, one of `10`, `20`, `50` or `100`, e.g. `50`. Defaults to `10`.",
      options: constants.HISTORY_PAGE_SIZES,
      default: 10,
    },
  },
  async run({ $ }) {
    if (Boolean(this.start) !== Boolean(this.end)) {
      throw new ConfigurationError("`start` and `end` must be provided together");
    }
    const response = await this.app.getUploadHistory({
      $,
      params: {
        profile_username: this.profileUsername,
        platform: this.platform,
        status: this.status,
        request_id: this.requestId,
        job_id: this.jobId,
        external_id: this.externalId,
        start: this.start,
        end: this.end,
        page: this.page,
        limit: this.limit,
      },
    });
    const count = response?.history?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} upload${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

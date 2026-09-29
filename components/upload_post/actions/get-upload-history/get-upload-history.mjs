import app from "../../upload_post.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "upload_post-get-upload-history",
  name: "Get Upload History",
  description: "Retrieve a paginated list of past uploads with per-platform results. [See the documentation](https://docs.upload-post.com/api/upload-history)",
  version: "0.0.1",
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
      description: "Return only the uploads of this profile",
      optional: true,
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "Return only the uploads to this platform",
      options: constants.HISTORY_PLATFORMS.map((value) => ({
        label: constants.PLATFORM_LABELS[value],
        value,
      })),
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Return only successful or only failed uploads",
      options: [
        "success",
        "failed",
      ],
      optional: true,
    },
    requestId: {
      propDefinition: [
        app,
        "requestId",
      ],
      description: "Exact match: every platform row produced by one upload request",
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
      description: "Exact match: every platform row produced by one scheduled or async job",
    },
    externalId: {
      propDefinition: [
        app,
        "externalId",
      ],
      description: "Exact match: the rows of the post you tagged with this `external_id`",
    },
    start: {
      type: "string",
      label: "Start Date",
      description: "Start of the date range, `YYYY-MM-DD` or ISO 8601. Requires **End Date**.",
      optional: true,
    },
    end: {
      type: "string",
      label: "End Date",
      description: "End of the date range, `YYYY-MM-DD` or ISO 8601. Requires **Start Date**; the range can span at most 2 months.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number. Defaults to `1`.",
      min: 1,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Page size. Defaults to `10`.",
      options: constants.HISTORY_PAGE_SIZES,
      optional: true,
    },
  },
  async run({ $ }) {
    if (Boolean(this.start) !== Boolean(this.end)) {
      throw new Error("**Start Date** and **End Date** must be provided together");
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

import claap from "../../claap.app.mjs";

export default {
  key: "claap-list-recordings",
  name: "List Recordings",
  description: "List recordings in Claap. [See the documentation](https://docs.claap.io/api-reference/endpoint/list_recordings).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    claap,
    channelId: {
      propDefinition: [
        claap,
        "channelId",
      ],
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Minimum creation timestamp to filter recordings",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Maximum creation timestamp to filter recordings",
      optional: true,
    },
    labels: {
      type: "string",
      label: "Labels",
      description: "Comma-separated label filters",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results per page (1-100, default: 20)",
      optional: true,
      min: 1,
      max: 100,
    },
    recorderEmail: {
      type: "string",
      label: "Recorder Email",
      description: "Filter by recorder email",
      optional: true,
    },
    recorderId: {
      type: "string",
      label: "Recorder ID",
      description: "Filter by recorder ID",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order for results (default: `created_desc`)",
      optional: true,
      options: [
        "created_asc",
        "created_desc",
        "duration_asc",
        "duration_desc",
        "title_asc",
        "title_desc",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.claap.listRecordings({
      $,
      params: {
        channelId: this.channelId,
        createdAfter: this.createdAfter,
        createdBefore: this.createdBefore,
        labels: this.labels,
        limit: this.limit,
        recorderEmail: this.recorderEmail,
        recorderId: this.recorderId,
        sort: this.sort,
      },
    });
    const count = response.result?.recordings?.length || 0;
    $.export("$summary", `Successfully retrieved ${count} recording${count === 1
      ? ""
      : "s"}.`);
    return response;
  },
};

import constants from "../../common/constants.mjs";
import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-list-account-bans",
  name: "List Account Bans",
  description: "List validated ban reports and appeals for your delivered accounts (appeal pending / accepted / refused, staff resolution)."
    + " Use **Since** as a polling watermark. To react in real time, use the **Account Banned** trigger instead."
    + " [See the documentation](https://developers.tokportal.com/bans-and-appeals/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tokportal,
    status: {
      type: "string",
      label: "Status",
      description: "Filter by appeal lifecycle status.",
      options: constants.BAN_STATUS_OPTIONS,
      optional: true,
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "Filter by staff commercial resolution. `pending` selects confirmed bans still awaiting the staff decision.",
      options: constants.BAN_RESOLUTION_OPTIONS,
      optional: true,
    },
    accountId: {
      propDefinition: [
        tokportal,
        "accountId",
      ],
      optional: true,
    },
    since: {
      type: "string",
      label: "Since",
      description: "Only reports updated at or after this ISO 8601 timestamp (for example `2026-08-01T00:00:00Z`). Use the highest `updated_at` you have seen as a polling watermark.",
      optional: true,
    },
    includeScreenshots: {
      type: "boolean",
      label: "Include Screenshots",
      description: "Whether to include a signed 7-day URL of the ban-evidence screenshot when one exists.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        tokportal,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const reports = [];
    const items = this.tokportal.paginate({
      $,
      fn: this.tokportal.listAccountBans,
      maxResults: this.maxResults,
      params: {
        status: this.status,
        resolution: this.resolution,
        account_id: this.accountId,
        since: this.since,
        include_screenshots: this.includeScreenshots === undefined
          ? undefined
          : String(this.includeScreenshots),
      },
    });
    for await (const item of items) {
      reports.push(item);
    }
    $.export("$summary", `Retrieved ${reports.length} ban report${reports.length === 1
      ? ""
      : "s"}`);
    return reports;
  },
};

import app from "../../darkmoon.app.mjs";

export default {
  key: "darkmoon-list-findings",
  name: "List Findings",
  description: "List vulnerabilities (findings) discovered by Darkmoon, optionally filtered by campaign, severity, category or status. Each finding includes title, severity, CVSS score, category, endpoint and remediation advice. Requires a Darkmoon Pro dashboard API. [See the documentation](https://github.com/ASCIT31/Dark-Moon)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
      optional: true,
    },
    severity: {
      propDefinition: [
        app,
        "severity",
      ],
    },
    category: {
      type: "string",
      label: "Category",
      description: "Only return findings of this category, e.g. `sql_injection`, `xss_stored`, `ssrf`, `remote_code_execution`.",
      optional: true,
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listFindings({
      $,
      params: {
        campaign_id: this.campaignId,
        severity: this.severity,
        category: this.category,
        status: this.status,
      },
    });
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Found ${count} finding${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

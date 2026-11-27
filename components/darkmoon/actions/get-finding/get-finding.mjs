import app from "../../darkmoon.app.mjs";

export default {
  key: "darkmoon-get-finding",
  name: "Get Finding",
  description: "Retrieve a single Darkmoon finding (vulnerability) by ID, with its severity, CVSS score, CVE, MITRE ATT&CK mapping, evidence and remediation advice. Requires a Darkmoon Pro dashboard API. [See the documentation](https://github.com/ASCIT31/Dark-Moon)",
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
    findingId: {
      propDefinition: [
        app,
        "findingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getFinding({
      $,
      findingId: this.findingId,
    });
    const title = response?.data?.title;
    $.export("$summary", `Retrieved finding ${this.findingId}${title
      ? `: ${title}`
      : ""}`);
    return response;
  },
};

import app from "../../darkmoon.app.mjs";

export default {
  key: "darkmoon-launch-campaign",
  name: "Launch Campaign",
  description: "Start an autonomous Darkmoon pentest campaign against a target and return the `run_id` of the run. Only scan systems you are authorized to test. Use **List Campaigns** to follow its progress. Requires a Darkmoon Pro dashboard API. [See the documentation](https://github.com/ASCIT31/Dark-Moon)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    target: {
      type: "string",
      label: "Target",
      description: "The host or URL to test, e.g. `https://staging.example.com`. You must be authorized to test it.",
    },
    outOfScope: {
      type: "string[]",
      label: "Out of Scope",
      description: "Hosts or paths the agents must not touch, e.g. `https://staging.example.com/admin`.",
      optional: true,
    },
    focus: {
      type: "string[]",
      label: "Focus",
      description: "Vulnerability classes or areas to prioritize, e.g. `sql_injection`, `authentication`.",
      optional: true,
    },
    noise: {
      type: "string",
      label: "Noise",
      description: "How loud the scan is allowed to be, as understood by your Darkmoon deployment, e.g. `low`.",
      optional: true,
    },
    safeHarbor: {
      type: "string",
      label: "Safe Harbor",
      description: "Optional safe harbor or authorization statement attached to the run, e.g. `Authorized by the security team, ticket SEC-123`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.launchCampaign({
      $,
      data: {
        target: this.target,
        out_of_scope: this.outOfScope,
        focus: this.focus,
        noise: this.noise,
        safe_harbor: this.safeHarbor,
      },
    });
    $.export("$summary", `Launched campaign against ${this.target}${response?.run_id
      ? ` (run ${response.run_id})`
      : ""}`);
    return response;
  },
};

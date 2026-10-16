import app from "../../darkmoon.app.mjs";

export default {
  key: "darkmoon-list-campaigns",
  name: "List Campaigns",
  description: "List Darkmoon pentest campaigns, optionally filtered by target ID or campaign status. Returns each campaign with its target, status and severity counts. Requires a Darkmoon Pro dashboard API. [See the documentation](https://github.com/ASCIT31/Dark-Moon)",
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
    targetId: {
      type: "string",
      label: "Target ID",
      description: "Only return campaigns run against this target ID.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only return campaigns with this status.",
      options: [
        "queued",
        "running",
        "completed",
        "stopped",
        "failed",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listCampaigns({
      $,
      params: {
        target_id: this.targetId,
        status: this.status,
      },
    });
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Found ${count} campaign${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

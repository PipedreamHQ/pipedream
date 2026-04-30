import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-monitor-stats",
  name: "Get Monitor Statistics",
  description: "Get overall monitor statistics. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/statistics)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getMonitorStats({
      $,
    });
    $.export("$summary", "Successfully retrieved monitor statistics");
    return response;
  },
};

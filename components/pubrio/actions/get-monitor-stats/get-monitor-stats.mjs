import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-monitor-stats",
  name: "Get Monitor Statistics",
  description: "Get overall monitor statistics. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    destructiveHint: false,
  },
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getMonitorStats({
      $,
      data: {},
    });
    $.export("$summary", "Successfully retrieved monitor statistics");
    return response;
  },
};

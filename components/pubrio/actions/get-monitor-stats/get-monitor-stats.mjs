import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-monitor-stats",
  name: "Get Monitor Statistics",
  description: "Get overall monitor statistics. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/statistics",
      data: {},
    });
    $.export("$summary", "Successfully retrieved monitor statistics");
    return response;
  },
};

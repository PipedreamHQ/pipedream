import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-monitor-logs",
  name: "Get Monitor Logs",
  description: "Get logs for a specific monitor. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to get logs for",
    },
    page: { propDefinition: [pubrio, "page"] },
    perPage: { propDefinition: [pubrio, "perPage"] },
  },
  async run({ $ }) {
    const data = {
      monitor_id: this.monitorId,
    };
    if (this.page != null) data.page = this.page;
    if (this.perPage != null) data.per_page = this.perPage;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/statistics/logs",
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} monitor logs`);
    return response;
  },
};

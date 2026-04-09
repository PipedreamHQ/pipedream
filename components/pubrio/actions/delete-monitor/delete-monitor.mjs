import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-delete-monitor",
  name: "Delete Monitor",
  description: "Delete an existing signal monitor. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to delete",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/delete",
      data: { monitor_id: this.monitorId },
    });
    $.export("$summary", "Successfully deleted monitor");
    return response;
  },
};

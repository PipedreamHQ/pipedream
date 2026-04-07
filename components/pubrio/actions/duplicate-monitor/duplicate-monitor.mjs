import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-duplicate-monitor",
  name: "Duplicate Monitor",
  description: "Duplicate an existing signal monitor. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to duplicate",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name for the duplicated monitor",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      monitor_id: this.monitorId,
    };
    if (this.name) data.name = this.name;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/duplicate",
      data,
    });
    $.export("$summary", "Successfully duplicated monitor");
    return response;
  },
};

import campaignMonitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-add-subscriber",
  name: "Add Subscriber",
  description: "Creates a new subscriber on a specific list. [See the documentation](https://www.campaignmonitor.com/api/subscribers/#adding-a-subscriber)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    campaignMonitor,
    email: {
      propDefinition: [
        campaignMonitor,
        "email",
      ],
    },
    listId: {
      propDefinition: [
        campaignMonitor,
        "listId",
      ],
    },
    name: {
      propDefinition: [
        campaignMonitor,
        "name",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response =
      await this.campaignMonitor.createSubscriber(this.email, this.listId, this.name);
    $.export("$summary", `Successfully added subscriber ${this.email} to list ${this.listId}`);
    return response;
  },
};

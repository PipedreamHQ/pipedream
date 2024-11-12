import campaignMonitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-unsubscribe",
  name: "Unsubscribe",
  description: "Removes a subscriber from a mailing list given their email address.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    campaignMonitor,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the subscriber to remove",
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the mailing list from which to remove the subscriber",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.campaignMonitor.removeSubscriber(this.email, this.listId);
    $.export("$summary", `Successfully unsubscribed ${this.email}`);
    return response;
  },
};

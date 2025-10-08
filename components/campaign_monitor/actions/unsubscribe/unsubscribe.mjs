import campaignMonitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-unsubscribe",
  name: "Unsubscribe",
  description: "Removes a subscriber from a mailing list given their email address. [See the documentation](https://www.campaignmonitor.com/api/v3-3/subscribers/#unsubscribing-a-subscriber)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    campaignMonitor,
    clientId: {
      propDefinition: [
        campaignMonitor,
        "clientId",
      ],
    },
    listId: {
      propDefinition: [
        campaignMonitor,
        "listId",
        (c) => ({
          clientId: c.clientId,
        }),
      ],
    },
    subscriber: {
      propDefinition: [
        campaignMonitor,
        "subscriber",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.campaignMonitor.unsubscribeSubscriber({
      $,
      listId: this.listId,
      data: {
        EmailAddress: this.subscriber,
      },
    });
    $.export("$summary", `Successfully unsubscribed ${this.subscriber}`);
    return response;
  },
};

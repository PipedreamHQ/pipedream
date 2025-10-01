import pipedream from "../../pipedream.app.mjs";

export default {
  key: "pipedream-delete-subscription",
  name: "Delete a Subscription",
  description: "Delete a Subscription. [See Doc](https://pipedream.com/docs/api/rest/#delete-a-subscription)",
  version: "0.1.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream,
    subscriptionCategory: {
      propDefinition: [
        pipedream,
        "subscriptionCategory",
      ],
    },
    subscriptionSource: {
      propDefinition: [
        pipedream,
        "subscriptionSource",
        (c) => ({
          subscriptionCategory: c.subscriptionCategory,
        }),
      ],
    },
    eventName: {
      propDefinition: [
        pipedream,
        "eventName",
      ],
    },
    listenerId: {
      propDefinition: [
        pipedream,
        "listenerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pipedream
      .deleteSubscription(this.subscriptionSource, this.listenerId, this.eventName);
    response?.data?.length > 0 && $.export("$summary", "Successfully deleted Subscription");
    return response;
  },
};

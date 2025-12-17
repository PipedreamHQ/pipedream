import pipedream from "../../pipedream.app.mjs";

export default {
  key: "pipedream-create-subscription",
  name: "Create a Subscription",
  description: "Create a Subscription. [See Doc](https://pipedream.com/docs/api/rest/#subscriptions)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
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
      .subscribe(this.subscriptionSource, this.listenerId, this.eventName);
    response?.data?.length > 0 && $.export("$summary", "Successfully created Subscription");
    return response;
  },
};

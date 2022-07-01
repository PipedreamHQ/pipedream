import pipedream from "../../pipedream.app.mjs";

export default {
  key: "pipedream-delete-subscription",
  name: "Delete a Subscription",
  description: "Delete a Subscription. [See Doc](https://pipedream.com/docs/api/rest/#delete-a-subscription)",
  version: "0.0.1",
  type: "action",
  props: {
    pipedream,
    emitterId: {
      propDefinition: [
        pipedream,
        "emitterId",
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
      .deleteSubscription(this.emitterId, this.listenerId, this.eventName);
    response?.data?.length > 0 && $.export("$summary", "Successfully deleted Subscription");
    return response;
  },
};

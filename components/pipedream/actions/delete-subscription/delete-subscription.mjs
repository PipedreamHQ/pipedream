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
      type: "string",
      label: "Event name",
      description: "Event name",
    },
    listenerId: {
      type: "string",
      label: "Listener ID",
      description: "Listener ID",
    },
  },
  async run({ $ }) {
    const response = await this.pipedream
      .deleteSubscription(this.emitterId, this.listenerId, this.eventName);
    response?.data?.length > 0 && $.export("$summary", "Successfully deleted Subscription");
    return response;
  },
};

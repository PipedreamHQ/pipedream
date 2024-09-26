import app from "../../doppler_marketing_automation.app.mjs";

export default {
  name: "Remove Subscriber",
  version: "0.0.1",
  key: "doppler_marketing_automation-remove-subscriber",
  description: "Remove a subscriber. [See the documentation](https://restapi.fromdoppler.com/docs/resources#!/Subscribers/AccountsByAccountNameListsByListIdSubscribersByEmailDelete)",
  type: "action",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
    email: {
      propDefinition: [
        app,
        "subscriberEmail",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.removeSubscriber({
      $,
      email: this.email,
      listId: this.listId,
    });

    if (response) {
      $.export("$summary", `Successfully removed subscriber with email ${this.email}`);
    }

    return response;
  },
};

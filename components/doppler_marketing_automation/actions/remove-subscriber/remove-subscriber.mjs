import app from "../../doppler_marketing_automation.app.mjs";

export default {
  key: "doppler_marketing_automation-remove-subscriber",
  name: "Remove Subscriber",
  description: "Removes a subscriber from a list completely. [See the documentation](https://restapi.fromdoppler.com/docs/resources#!/Subscribers/AccountsByAccountNameListsByListIdSubscribersByEmailDelete)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        ({ listId }) => ({
          listId,
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
    $.export("$summary", `Successfully removed subscriber: ${this.email} from list: ${this.listId}`);
    return response;
  },
};

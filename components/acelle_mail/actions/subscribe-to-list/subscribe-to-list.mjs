import app from "../../acelle_mail.app.mjs";

export default {
  name: "Subscribe To List",
  version: "0.0.1",
  key: "acelle_mail-subscribe-to-list",
  description: "Subscribe a subscriber to a list. [See the documentation](https://api.acellemail.com/#subscribers_subscribe)",
  type: "action",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
    subscriberId: {
      propDefinition: [
        app,
        "subscriberId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.subscribeToList({
      $,
      subscriberId: this.subscriberId,
      listId: this.listId,
    });

    if (response) {
      $.export("$summary", `Successfully subscribed to list with ID \`${this.listId}\``);
    }

    return response;
  },
};

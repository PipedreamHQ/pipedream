import app from "../../acelle_mail.app.mjs";

export default {
  name: "Unsubscribe To List",
  version: "0.0.1",
  key: "acelle_mail-unsubscribe-to-list",
  description: "Unsubscribe a subscriber to a list. [See the documentation](https://api.acellemail.com/#subscribers_unsubscribe)",
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
    const response = await this.app.unsubscribeFromList({
      $,
      subscriberId: this.subscriberId,
      listId: this.listId,
    });

    if (response) {
      $.export("$summary", `Successfully unsubscribed from list with ID \`${this.listId}\``);
    }

    return response;
  },
};

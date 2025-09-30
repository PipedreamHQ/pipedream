import sendloop from "../../sendloop.app.mjs";

export default {
  key: "sendloop-remove-subscriber",
  name: "Remove Subscriber",
  description: "Unsubscribe an email address from your lists.",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendloop,
    listId: {
      propDefinition: [
        sendloop,
        "listId",
      ],
    },
    subscriberEmail: {
      propDefinition: [
        sendloop,
        "subscriberEmail",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    unsubscriptionIp: {
      type: "string",
      label: "Unsubscription IP",
      description: "IP address of the unsubscription",
    },
  },
  async run({ $ }) {
    const response = await this.sendloop.removeSubscriber({
      $,
      data: {
        ListID: this.listId,
        EmailAddress: this.subscriberEmail,
        UnsubscriptionIP: this.unsubscriptionIp,
      },
    });
    if (response.Success) {
      $.export("$summary", `Successfully removed subscriber ${this.subscriberEmail}.`);
    }
    return response;
  },
};

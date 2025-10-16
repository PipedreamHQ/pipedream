import sendloop from "../../sendloop.app.mjs";

export default {
  key: "sendloop-add-subscriber",
  name: "Add Subscriber",
  description: "Adds a new subscriber to a specified list.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendloop,
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the subscriber",
    },
    listId: {
      propDefinition: [
        sendloop,
        "listId",
      ],
    },
    subscriptionIp: {
      type: "string",
      label: "Subscription IP",
      description: "IP address of the subscriber",
    },
  },
  async run({ $ }) {
    const response = await this.sendloop.addSubscriber({
      $,
      data: {
        EmailAddress: this.emailAddress,
        ListID: this.listId,
        SubscriptionIP: this.subscriptionIp,
      },
    });
    if (response.Success) {
      $.export("$summary", `Successfully added subscriber ${this.emailAddress} to list ${this.listId}`);
    }
    return response;
  },
};

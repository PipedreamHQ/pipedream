import sendloop from "../../sendloop.app.mjs";

export default {
  key: "sendloop-remove-subscriber",
  name: "Remove Subscriber",
  description: "Removes an email address from a specified list.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sendloop,
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the subscriber.",
      required: true,
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list to which the subscriber will be added or removed from.",
      required: true,
    },
  },
  async run({ $ }) {
    const response = await this.sendloop.removeSubscriber(this.emailAddress, this.listId);
    $.export("$summary", `Successfully removed subscriber ${this.emailAddress} from list ${this.listId}`);
    return response;
  },
};

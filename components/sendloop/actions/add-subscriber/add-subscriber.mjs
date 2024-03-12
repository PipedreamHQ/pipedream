import sendloop from "../../sendloop.app.mjs";

export default {
  key: "sendloop-add-subscriber",
  name: "Add Subscriber",
  description: "Adds a new subscriber to a specified list. [See the documentation](https://developers.sendloop.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sendloop,
    emailAddress: {
      propDefinition: [
        sendloop,
        "emailAddress",
      ],
    },
    listId: {
      propDefinition: [
        sendloop,
        "listId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendloop.addSubscriber(this.emailAddress, this.listId);
    $.export("$summary", `Successfully added subscriber ${this.emailAddress} to list ${this.listId}`);
    return response;
  },
};

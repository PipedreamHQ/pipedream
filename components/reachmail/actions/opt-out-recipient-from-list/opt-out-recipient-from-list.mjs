import reachmail from "../../reachmail.app.mjs";

export default {
  key: "reachmail-opt-out-recipient-from-list",
  name: "Opt Out Recipient From List",
  description: "Opt out a recipient from a given list. The user needs to provide the recipient's email address and the ID of the list as props. The action will remove the recipient from the specified list. [See the documentation](https://services.reachmail.net/)",
  version: "0.0.1",
  type: "action",
  props: {
    reachmail,
    recipient: {
      type: "string",
      label: "Recipient Email",
      description: "The email address of the recipient.",
    },
    listId: {
      propDefinition: [
        reachmail,
        "listId",
      ],
      type: "string",
      description: "The ID of the list from which the recipient should be opted out.",
    },
  },
  async run({ $ }) {
    const response = await this.reachmail.optOutRecipient({
      $,
      listId: this.listId,
      data: {
        recipient: this.recipient,
      },
    });
    $.export("$summary", `Successfully opted out ${this.recipient} from list ${this.listId}`);
    return response;
  },
};

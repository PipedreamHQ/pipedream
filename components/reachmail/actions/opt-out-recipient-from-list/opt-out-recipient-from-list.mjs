import reachmail from "../../reachmail.app.mjs";

export default {
  key: "reachmail-opt-out-recipient-from-list",
  name: "Opt Out Recipient From List",
  description: "The action will remove the recipient from the specified list. [See the documentation](https://services.reachmail.net/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        Email: this.recipient,
      },
    });
    $.export("$summary", `Successfully opted out ${this.recipient} from list ${this.listId}`);
    return response;
  },
};

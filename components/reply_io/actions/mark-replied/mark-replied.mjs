import reply from "../../reply_io.app.mjs";

export default {
  key: "reply_io-mark-replied",
  name: "Mark Contact as Replied",
  description: "Mark a contact as replied in all campaigns by their email address. [See the docs here](https://apidocs.reply.io/#d50b7259-910a-4620-9e5a-59c2b5249f57)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    reply,
    contactEmail: {
      propDefinition: [
        reply,
        "contactEmail",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      email: this.contactEmail,
    };
    await this.reply.markAsReplied({
      data,
      $,
    });
    $.export("$summary", `Successfully marked contact ${this.contactEmail} as replied in all campaigns.`);
    // nothing to return;
  },
};

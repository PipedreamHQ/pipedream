import reply from "../../reply_io.app.mjs";

export default {
  key: "reply_io-mark-finished",
  name: "Mark Contact as Finished",
  description: "Mark a contact as finished in all campaigns by their email address. [See the docs here](https://apidocs.reply.io/#1433199e-b249-4077-9e32-ad7ac8fbba54)",
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
    await this.reply.markAsFinished({
      data,
      $,
    });
    $.export("$summary", `Successfully marked contact ${this.contactEmail} as finished in all campaigns.`);
    // nothing to return;
  },
};

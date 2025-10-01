import loops from "../../loops_so.app.mjs";

export default {
  key: "loops_so-send-transactional-email",
  name: "Send Transactional Email",
  description: "Send a transactional email. [See the Documentation](https://loops.so/docs/transactional/guide#send-your-email)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    loops,
    transactionalId: {
      type: "string",
      label: "Transactional ID",
      description: "The transactional ID",
    },
    email: {
      propDefinition: [
        loops,
        "email",
      ],
    },
    dataVariables: {
      type: "object",
      label: "Data Variables",
      description: "Key/value pairs specifying the data variables for this transactional email",
    },
  },
  async run({ $ }) {
    const response = await this.loops.sendTransactionalEmail({
      data: {
        transactionalId: this.transactionalId,
        email: this.email,
        dataVariables: this.dataVariables,
      },
      $,
    });

    $.export("$summary", `Successfully sent transactional email to  ${this.email}.`);

    return response;
  },
};

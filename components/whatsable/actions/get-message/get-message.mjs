import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Get Message",
  description: "Retrieve a specific message from Whatsable",
  key: "whatsable-get-message",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },

  props: {
    whatsable,
    message_id: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message to retrieve",
    },
  },

  async run({ $ }) {
    const response = await this.whatsable.getMessage({
      $,
      id: this.message_id,
    });

    $.export("$summary", `Retrieved message ${this.message_id}`);

    return response;
  },
};

import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-get-message",
  name: "Get Message",
  description: "Retrieve a message by its ID. [See the documentation](https://dev.frontapp.com/reference/get-message)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frontApp,
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The unique identifier of the message to retrieve",
    },
  },
  async run({ $ }) {
    const response = await this.frontApp.makeRequest({
      $,
      path: `/messages/${this.messageId}`,
    });
    $.export("$summary", `Successfully retrieved message with ID: ${this.messageId}`);
    return response;
  },
};

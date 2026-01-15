import hana from "../../hana.app.mjs";

export default {
  key: "hana-create-google-chat-message",
  name: "Create Google Chat Message",
  description: "Create a Google Chat message. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#create-google-chat-message)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    hana,
    spaceName: {
      propDefinition: [
        hana,
        "spaceName",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The actual text content of the message being sent",
    },
  },
  async run({ $ }) {
    const response = await this.hana.createGoogleChatMessage({
      $,
      data: {
        spaceName: this.spaceName,
        message: this.message,
      },
    });
    $.export("$summary", "Successfully created Google Chat message.");
    return response;
  },
};

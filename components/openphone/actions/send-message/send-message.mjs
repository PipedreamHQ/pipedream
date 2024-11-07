import { ConfigurationError } from "@pipedream/platform";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-send-message",
  name: "Send a Text Message via OpenPhone",
  description: "Send a text message from your OpenPhone number to a recipient. [See the documentation](https://www.openphone.com/docs/api-reference/messages/send-a-text-message)",
  version: "0.0.1",
  type: "action",
  props: {
    openphone,
    from: {
      propDefinition: [
        openphone,
        "from",
      ],
    },
    to: {
      type: "string",
      label: "To",
      description: "Recipient phone number in E.164 format.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The text content of the message to be sent.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.openphone.sendTextMessage({
        $,
        data: {
          content: this.content,
          from: this.from,
          to: [
            this.to,
          ],
          setInboxStatus: "done",
        },
      });
      $.export("$summary", `Successfully sent message to ${this.to}`);
      return response;

    } catch ({ response }) {
      let errorMessage = "";

      if (response.data.errors) {
        errorMessage = `Prop: ${response.data.errors[0].path} - ${response.data.errors[0].message}`;
      } else {
        errorMessage = response.data.message;
      }

      throw new ConfigurationError(errorMessage);
    }
  },
};

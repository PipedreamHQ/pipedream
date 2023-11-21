import callpage from "../../callpage.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "callpage-create-sms",
  name: "Create SMS",
  description: "Creates a new SMS in CallPage. [See the documentation](https://callpage.github.io/documentation-rest/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    callpage,
    widgetId: {
      propDefinition: [
        callpage,
        "widgetId",
      ],
    },
    messageId: {
      propDefinition: [
        callpage,
        "messageId",
      ],
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Indicates whether the SMS message should be enabled or not.",
      default: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the SMS message. It cannot be longer than 240 characters.",
    },
  },
  async run({ $ }) {
    const response = await this.callpage.createSMS({
      widgetId: this.widgetId,
      messageId: this.messageId,
      enabled: this.enabled,
      text: this.text,
    });

    $.export("$summary", `Successfully created SMS with ID: ${response.id}`);
    return response;
  },
};

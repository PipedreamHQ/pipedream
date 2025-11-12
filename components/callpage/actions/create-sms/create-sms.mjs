import callpage from "../../callpage.app.mjs";
import { MESSAGE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "callpage-create-sms",
  name: "Create SMS",
  description: "Creates a new SMS in CallPage. [See the documentation](https://callpage.github.io/documentation-rest/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      type: "string",
      label: "Message Id",
      description: "Select a message identifier.",
      options: MESSAGE_OPTIONS,
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Indicates whether the message should be enabled or not.",
      optional: true,
    },
    text: {
      type: "string",
      label: "SMS Text",
      description: "The text of the SMS to send.",
    },
  },
  async run({ $ }) {
    const response = await this.callpage.createSMS({
      data: {
        widget_id: this.widgetId,
        message_id: this.messageId,
        enbled: this.enabled || true,
        text: this.text,
      },
    });

    $.export("$summary", `Successfully created SMS with id ${response.data?.id}`);
    return response;
  },
};

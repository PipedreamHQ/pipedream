import streamlabs from "../../streamlabs.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "streamlabs-send-alert",
  name: "Send Alert",
  description: "Sends an alert to the stream overlay with a custom message, image, and sound. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    streamlabs: {
      type: "app",
      app: "streamlabs",
    },
    alertMessageContent: {
      propDefinition: [
        streamlabs,
        "alertMessageContent",
      ],
    },
    alertImageUrl: {
      propDefinition: [
        streamlabs,
        "alertImageUrl",
      ],
      optional: true,
    },
    alertSoundUrl: {
      propDefinition: [
        streamlabs,
        "alertSoundUrl",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.streamlabs.sendAlert({
      alertMessageContent: this.alertMessageContent,
      alertImageUrl: this.alertImageUrl,
      alertSoundUrl: this.alertSoundUrl,
    });
    $.export("$summary", `Alert sent with message: ${this.alertMessageContent}`);
    return response;
  },
};

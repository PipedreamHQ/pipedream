import orimon from "../../orimon.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "orimon-send-message",
  name: "Send Message to Orimon",
  description: "Sends a direct message to Orimon. [See the documentation](https://orimon.gitbook.io/docs/developer-api/message-api)",
  version: "0.0.1",
  type: "action",
  props: {
    orimon,
    text: orimon.propDefinitions.text,
    apiKey: orimon.propDefinitions.apiKey,
    tenantId: orimon.propDefinitions.tenantId,
    platformSessionId: orimon.propDefinitions.platformSessionId,
    messageId: orimon.propDefinitions.messageId,
  },
  async run({ $ }) {
    const response = await this.orimon.sendMessage({
      apiKey: this.apiKey,
      tenantId: this.tenantId,
      platformSessionId: this.platformSessionId,
      messageId: this.messageId,
      text: this.text,
    });

    $.export("$summary", "Message sent successfully to Orimon");
    return response;
  },
};

import botpenguin from "../../botpenguin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "botpenguin-send-session-message",
  name: "Send Session Message",
  description: "Sends a chat message in a session. Requires 'session_id' and 'content' props.",
  version: "0.0.1",
  type: "action",
  props: {
    botpenguin,
    sessionId: botpenguin.propDefinitions.sessionId,
    content: botpenguin.propDefinitions.content,
  },
  async run({ $ }) {
    const response = await this.botpenguin.sendMessage({
      sessionId: this.sessionId,
      content: this.content,
    });
    $.export("$summary", `Successfully sent message in session ${this.sessionId}`);
    return response;
  },
};

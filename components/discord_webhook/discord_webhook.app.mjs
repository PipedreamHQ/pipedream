import axios from "axios";
import FormData from "form-data";

export default {
  type: "app",
  app: "discord_webhook",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "Enter a simple message up to 2000 characters. This is the most commonly used field. However, it's optional if you pass embed content.",
    },
    embeds: {
      type: "any",
      label: "Embeds",
      description: "Optionally pass an [array of embed objects](https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html). E.g., ``{{ [{\"description\":\"Use markdown including *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`\"}] }}``. To pass data from another step, enter a reference using double curly brackets (e.g., `{{steps.mydata.$return_value}}`).\nTip: Construct the `embeds` array in a Node.js code step, return it, and then pass the return value to this step.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Overrides the current username of the webhook",
      optional: true,
    },
    avatarURL: {
      type: "string",
      label: "Avatar URL",
      description: "If used, it overrides the default avatar of the webhook. Note: Consecutive posts by the same username within 10 minutes of each other will not display updated avatar.",
      optional: true,
    },
    threadID: {
      type: "string",
      label: "Thread ID",
      description: "If provided, the message will be posted to this thread",
      optional: true,
    },
  },
  methods: {
    url() {
      return this.$auth.oauth_uid;
    },
    async sendMessage({
      content, embeds, username, avatarURL, threadID,
    }) {
      const serializedContent = (typeof content !== "string")
        ? JSON.stringify(content)
        : content;
      if (!threadID) threadID = undefined;
      const resp = await axios({
        method: "POST",
        url: this.url(),
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
        params: {
          thread_id: threadID,
        },
        data: {
          content: serializedContent,
          embeds,
          username,
          avatar_url: avatarURL,
        },
      });
      if (resp.status >= 400) {
        throw new Error(JSON.stringify(resp.data));
      }
      return resp.data;
    },
    async sendMessageWithFile({
      content, username, avatarURL, embeds, threadID, file,
    }) {
      const data = new FormData();
      const serializedContent = (typeof content !== "string")
        ? JSON.stringify(content)
        : content;
      data.append("payload_json", JSON.stringify({
        content: serializedContent,
        username,
        avatar_url: avatarURL,
        embeds,
      }));
      if (file) data.append("file", file);
      if (!threadID) threadID = undefined;
      const resp = await axios({
        method: "POST",
        url: this.url(),
        headers: {
          "Content-Type": "multipart/form-data; boundary=" + data._boundary,
        },
        validateStatus: () => true,
        params: {
          thread_id: threadID,
        },
        data,
        file,
      });
      if (resp.status >= 400) {
        throw new Error(JSON.stringify(resp.data));
      }
      return resp.data;
    },
  },
};

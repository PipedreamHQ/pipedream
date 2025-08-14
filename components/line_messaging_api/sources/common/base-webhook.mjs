import line from "../../line_messaging_api.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    line,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      try {
        await this.line.getWebhook();
        await this.line.createWebhook({
          data: {
            endpoint: this.http.endpoint,
          },
        });
        console.log("Webhook created successfully.");
        console.log("If you are not receiving webhooks, please confirm you have Use Webhooks enabled in your Line Developer Console:");
      } catch (error) {
        throw new ConfigurationError("Error creating webhook. Please make sure you have enabled webhooks in your Line Developer Console.");
      }
      console.log("https://developers.line.biz/en/docs/messaging-api/building-bot/#setting-webhook-url");
    },
  },
};

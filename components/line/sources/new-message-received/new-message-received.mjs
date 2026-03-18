import line from "../../line.app.mjs";
import sampleEmit from "./test-event.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "line-new-message-received",
  name: "New Message Received",
  description: "Emit new event for every received message in a channel. [See docs here](https://developers.line.biz/en/docs/messaging-api/building-bot/#page-title)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    line,
    db: "$.service.db",
    http: "$.interface.http",
    channelAccessToken: {
      propDefinition: [
        line,
        "channelAccessToken",
      ],
    },
  },
  hooks: {
    async activate() {
      try {
        await this.checkWebhook();
        await this.createWebhook();
        console.log("Webhook created successfully.");
        console.log("If you are not receiving webhooks, please confirm you have Use Webhooks enabled in your Line Developer Console:");
      } catch (error) {
        console.log(error);
        console.log("Please make sure you have enabled webhooks in your Line Developer Console:");
      }
      console.log("https://developers.line.biz/en/docs/messaging-api/building-bot/#setting-webhook-url");
    },
  },
  methods: {
    async _makeRequest(opts) {
      await axios(null, {
        ...opts,
        url: "https://api.line.me/v2/bot/channel/webhook/endpoint",
        headers: {
          Authorization: `Bearer ${this.channelAccessToken}`,
        },
      });
    },
    async checkWebhook() {
      await this._makeRequest();
    },
    async createWebhook() {
      await this._makeRequest({
        method: "put",
        data: {
          endpoint: this.http.endpoint,
        },
      });
    },
  },
  async run(event) {
    event.body.events.forEach((event) => {
      if (event.type === "message") {
        this.$emit(event, {
          id: event.message.id,
          summary: event.message.text,
          ts: event.timestamp,
        });
      }
    });
  },
  sampleEmit,
};

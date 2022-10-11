import { uuid } from "uuidv4";
import { ConfigurationError } from "@pipedream/platform";
import vk from "../app/vk.app";
import constants from "../common/constants";

export default {
  props: {
    vk,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    groupId: {
      propDefinition: [
        vk,
        "groupId",
      ],
    },
  },
  hooks: {
    async activate() {
      await this.createWebhook();
    },
    async deactivate() {
      await this.removeWebhook();
    },
  },
  methods: {
    setWebhookId(webhookId: string) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId(): string {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setSecretKey(token: string) {
      this.db.set(constants.SECRET_KEY, token);
    },
    getSecretKey(): string {
      return this.db.get(constants.SECRET_KEY);
    },
    async createWebhook() {
      console.log("createWebhook");
      const secretKey = uuid();
      const response =
        await this.vk.addCallbackServer({
          params: {
            group_id: this.groupId,
            url: this.http.endpoint,
            title: `Webhook ${Date.now()}`,
            secret_key: secretKey,
          },
        });
      console.log("response", response);
      const { response: webhookId } = response;

      this.setWebhookId(webhookId);
      this.setSecretKey(secretKey);
    },
    async removeWebhook() {
      console.log("removeWebhook");
      const webhookId = this.getWebhookId();

      await this.vk.deleteCallbackServer({
        params: {
          group_id: this.groupId,
          server_id: webhookId,
        },
      });
    },
    getMetadata() {
      throw new Error("getMetadata not implemented!");
    },
  },
  async run(event) {
    const {
      type,
      object: payload,
    } = event.body;
    const secretKey = this.getSecretKey();

    if (payload?.secret !== secretKey) {
      throw new ConfigurationError("Webhook secretKey is not valid!");
    }

    if (type === "confirmation") {
      this.http.respond({
        status: 200,
        body: "ok",
      });
    }

    this.$emit(event.body, this.getMetadata(payload));
  },
};

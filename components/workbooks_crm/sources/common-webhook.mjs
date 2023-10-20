import { createHmac } from "crypto";
import app from "../workbooks_crm.app.mjs";
import constants from "../common/constants.mjs";
import utils from "../common/utils.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setSecretKey(secretKey) {
      this.db.set(constants.SECRET_KEY, secretKey);
    },
    getSecretKey() {
      return this.db.get(constants.SECRET_KEY);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      return {};
    },
    getResourceName() {
      throw new Error("getResourceName is not implemented");
    },
    getTriggerId() {
      throw new Error("getTriggerId is not implemented");
    },
    isWebhookValid(signature, bodyRaw) {
      const digest = createHmac("sha256", this.getSecretKey())
        .update(Buffer.from(bodyRaw, "utf8"))
        .digest("hex");
      return signature === digest;
    },
    processEvent(resource) {
      const meta = this.getMetadata(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(stream) {
      const resources = await utils.streamIterator(stream);
      resources.forEach(this.processEvent);
    },
  },
  hooks: {
    async deploy() {
      const resourcesStream = await this.app.getResourcesStream({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
      });
      await this.processStreamEvents(resourcesStream);
    },
    async activate() {
      const {
        affected_objects: [
          {
            id: webhookId,
            secret_key: secretKey,
          },
        ],
      } = await this.app.createWebhookSubscription({
        data: {
          name: [
            `Pipedream Webhook ${Date.now()}`,
          ],
          description: [
            `Pipedream Webhook ${Date.now()}`,
          ],
          callback_url: [
            this.http.endpoint,
          ],
          enabled: [
            true,
          ],
          trigger_id: [
            this.getTriggerId(),
          ],
        },
      });
      this.setWebhookId(webhookId);
      this.setSecretKey(secretKey);
    },
    async deactivate() {
      await this.app.deleteWebhookSubscription({
        webhookId: this.getWebhookId(),
      });
    },
  },
  async run({
    body, bodyRaw, headers,
  }) {
    const { ["x-workbooks-signature"]: workbooksSignature } = headers;
    const signature = workbooksSignature.split("=")[1];

    if (!this.isWebhookValid(signature, bodyRaw)) {
      console.log("Signature does not match, skipping event");
      return;
    }

    body.forEach(({ [this.getResourceName()]: resource }) =>
      this.processEvent(resource));
  },
};

import crypto from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../userflow.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      const {
        getResourcesFn,
        getResourcesFnArgs,
        getResourcesName,
        processResource,
      } = this;

      const resourcesFn = getResourcesFn();

      if (!resourcesFn) {
        return console.log("There is no resourcesFn defined");
      }

      const { [getResourcesName()]: resources } =
        await resourcesFn(getResourcesFnArgs());

      Array.from(resources)
        .reverse()
        .forEach(processResource);
    },
    async activate() {
      const response =
        await this.createWebhook({
          data: {
            api_version: constants.API_VERSION,
            url: this.http.endpoint,
            topics: this.getTopics(),
          },
        });

      this.setWebhookId(response.id);
      this.setSecret(response.secret);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setSecret(value) {
      this.db.set(constants.WEBHOOK_SECRET, value);
    },
    getSecret() {
      return this.db.get(constants.WEBHOOK_SECRET);
    },
    getTopics() {
      throw new ConfigurationError("getTopics is not implemented");
    },
    getResourcesFn() {
      return;
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        path: "/webhook_subscriptions",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/webhook_subscriptions/${webhookId}`,
        ...args,
      });
    },
    getHeaderParts(header) {
      const tolerance = 300; // seconds
      const headerParts = header?.split(",")
        .reduce((acc, part) => {
          const [
            key,
            value,
          ] = part.split("=");

          return {
            ...acc,
            [key]: value,
          };
        }, {});

      if (!headerParts.t) {
        throw new Error("Userflow-Signature header check failed: Missing t parameter");
      }

      if (!headerParts.v1) {
        throw new Error("Userflow-Signature header check failed: Missing v1 signature");
      }

      const {
        t: timestamp,
        v1: signature,
      } = headerParts;

      const timestampAge = Math.floor(Date.now() / 1000) - timestamp;

      if (timestampAge > tolerance) {
        throw new Error(`Userflow-Signature header check failed: Timestamp is more than ${tolerance} seconds ago`);
      }

      return {
        timestamp,
        signature,
      };
    },
    isSignatureValid({
      headers, bodyRaw,
    } = {}) {
      const secret = this.getSecret();
      const { ["userflow-signature"]: header } = headers;

      const {
        timestamp,
        signature,
      } = this.getHeaderParts(header);

      const signedPayload = `${timestamp}.${bodyRaw}`;

      const expectedSignature =
        crypto
          .createHmac("sha256", secret)
          .update(signedPayload, "utf8")
          .digest("hex");

      return expectedSignature === signature;
    },
  },
  run({
    body, ...args
  }) {
    const isValid = this.isSignatureValid(args);

    if (!isValid) {
      return this.http.respond({
        status: 401,
      });
    }

    this.processResource(body?.data?.object ?? body);

    this.http.respond({
      status: 200,
    });
  },
};

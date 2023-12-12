import crypto from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const {
        http,
        createWebhook,
        getEventTypes,
        setWebhookId,
        setWebhookSecret,
      } = this;

      const response =
        await createWebhook({
          data: {
            url: http.endpoint,
            eventTypes: getEventTypes(),
          },
        });

      setWebhookId(response.id);

      // Not yet implemented by Zest
      setWebhookSecret(response.secret);
    },
    async deactivate() {
      const {
        deleteWebhook,
        getWebhookId,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          params: {
            id: webhookId,
          },
        });
      }
    },
  },
  methods: {
    ...common.methods,
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setWebhookSecret(value) {
      this.db.set(constants.WEBHOOK_SECRET, value);
    },
    getWebhookSecret() {
      return this.db.get(constants.WEBHOOK_SECRET) || "whsec_test/test";
    },
    getEventTypes() {
      throw new ConfigurationError("getEventTypes is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        path: "/hook",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this.app.delete({
        path: "/hook",
        ...args,
      });
    },
    // This fuction is based on the following documentation from Six (Webhook provider):
    // https://docs.svix.com/receiving/verifying-payloads/how-manual#determining-the-expected-signature
    verifySignature({
      headers, bodyRaw,
    }) {
      const webhookSecret = this.getWebhookSecret();
      const {
        ["svix-signature"]: signature,
        ["svix-id"]: id,
        ["svix-timestamp"]: ts,
      } = headers;

      const [
        , secret,
      ] = webhookSecret.split("_");
      const secretBytes = Buffer.from(secret, "base64");
      const data = `${id}.${ts}.${bodyRaw}`;
      const digest =
        crypto.createHmac("sha256", secretBytes)
          .update(data)
          .digest("base64");

      return signature === digest;
    },
  },
  async run({
    headers, body, bodyRaw,
  }) {
    const {
      http,
      validateWebhook = false, // This is a temporary workaround until we can get the webhook secret from the API
      verifySignature,
      processResource,
    } = this;

    const isValid = verifySignature({
      headers,
      bodyRaw,
    });

    if (validateWebhook && !isValid) {
      throw new ConfigurationError("Invalid signature");
    }

    http.respond({
      status: 200,
    });

    processResource({
      ...body,
      ts: headers["svix-timestamp"],
    });
  },
};

import { v4 as uuid } from "uuid";
import { createHmac } from "crypto";
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
        http: { endpoint: callback },
        createWebhook,
        listWebhooks,
        getEventName,
        setWebhookId,
        setSecretKey,
        getEntityId,
      } = this;
      const secretKey = uuid();
      const entityId = await getEntityId();

      await createWebhook({
        data: {
          event: getEventName(),
          entity_id: entityId,
          action: "callback",
          attributes: {
            callback,
            use_tls_12: true,
            secret_key: secretKey,
          },
        },
      });

      const { data } = await listWebhooks();
      const webhook = data.find(({ json_attributes: attrs }) => {
        return secretKey === attrs?.secret_key;
      });

      setSecretKey(secretKey);
      setWebhookId(webhook?.id);
    },
    async deactivate() {
      const {
        deleteWebhook,
        getWebhookId,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    getEntityId() {
      throw new ConfigurationError("getEntityId is not implemented");
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setSecretKey(value) {
      this.db.set(constants.SECRET_KEY, value);
    },
    getSecretKey() {
      return this.db.get(constants.SECRET_KEY);
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    verifySignature(bodyRaw, signature) {
      const secretKey = this.getSecretKey();
      const hash = createHmac("sha256", secretKey)
        .update(bodyRaw)
        .digest("base64");
      return hash === signature;
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/api/v2/events",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/v2/event-subscriptions/${webhookId}`,
        ...args,
      });
    },
    listWebhooks(args = {}) {
      return this.app._makeRequest({
        debug: true,
        path: "/v2/event-subscriptions",
        ...args,
      });
    },
  },
  async run({
    body, bodyRaw, headers: { ["x-signnow-signature"]: signature },
  }) {
    const {
      http,
      verifySignature,
      processResource,
    } = this;

    const validSignature = verifySignature(bodyRaw, signature);

    if (!validSignature) {
      return http.respond({
        status: 401,
      });
    }

    http.respond({
      status: 200,
    });

    processResource(body);
  },
};

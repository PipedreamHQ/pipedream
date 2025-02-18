import { createHmac } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../demandbase.app.mjs";
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
    async activate() {
      const {
        createSubscription,
        getData,
        http: { endpoint: webhook },
        setSubscriptionId,
        setSecret,
      } = this;

      const signingSecret = uuidv4();

      const response =
        await createSubscription({
          data: {
            webhook,
            signingSecret,
            ...getData(),
          },
        });

      setSubscriptionId(response.subscriptionId);
      setSecret(signingSecret);
    },
    async deactivate() {
      const {
        deleteSubscription,
        getSubscriptionId,
      } = this;

      const subscriptionId = getSubscriptionId();
      if (subscriptionId) {
        await deleteSubscription({
          subscriptionId,
        });
      }
    },
  },
  methods: {
    getData() {
      throw new ConfigurationError("getData is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setSubscriptionId(value) {
      this.db.set(constants.SUBSCRIPTION_ID, value);
    },
    getSubscriptionId() {
      return this.db.get(constants.SUBSCRIPTION_ID);
    },
    setSecret(value) {
      this.db.set(constants.SECRET, value);
    },
    getSecret() {
      return this.db.get(constants.SECRET);
    },
    getSubscriptionType() {
      throw new ConfigurationError("getSubscriptionType is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createSubscription(args = {}) {
      return this.app.post({
        path: "/subscription",
        ...args,
      });
    },
    deleteSubscription({
      subscriptionId, ...args
    } = {}) {
      return this.app.delete({
        path: `/subscription/${subscriptionId}`,
        ...args,
      });
    },
    validateSignature(headers, rawBody) {
      const signature = headers["X-InsideViewAPI-AlertDataSignature"];
      const signingSecret = this.getSecret();
      const computedSignature =
        createHmac("sha1", signingSecret)
          .update(rawBody)
          .digest("hex");

      if (signature !== computedSignature) {
        throw new Error("Invalid signature");
      }
    },
  },
  async run({
    method, body, headers, rawBody,
  }) {
    if (method === "HEAD") {
      return this.http.respond({
        status: 200,
        headers: {
          "X-InsideViewAPI-ValidationCode": headers["X-InsideViewAPI-ValidationCode"],
        },
      });
    }
    this.validateSignature(headers, rawBody);
    this.processResource(body);
  },
};

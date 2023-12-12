import { v4 as uuid } from "uuid";
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
    parserId: {
      propDefinition: [
        common.props.app,
        "parserId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        parserId,
        parserField,
      } = this;
      const apiKey = uuid();

      const { id: webhookId } =
        await this.createWebhook({
          data: {
            event: this.getEventName(),
            target: this.http.endpoint,
            category: "CUSTOM",
            parser: parserId,
            parser_field: parserField,
            headers: {
              api_key: apiKey,
            },
          },
        });

      this.setWebhookId(webhookId);
      this.setApiKey(apiKey);
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
    ...common.methods,
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setApiKey(value) {
      this.db.set(constants.API_KEY, value);
    },
    getApiKey() {
      return this.db.get(constants.API_KEY);
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    createWebhook(args = {}) {
      return this.app.create({
        path: "/webhook",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/webhook/${webhookId}`,
        ...args,
      });
    },
  },
  async run({
    body, headers,
  }) {
    const { api_key: apiKey } = headers;

    if (apiKey !== this.getApiKey()) {
      console.log("Invalid internal api key");
      return;
    }

    this.http.respond({
      status: 200,
    });

    this.$emit(body, this.generateMeta(body));
  },
};

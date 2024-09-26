import { ConfigurationError } from "@pipedream/platform";
import infobip from "../../infobip.app.mjs";

export default {
  props: {
    infobip,
    http: "$.interface.http",
    db: "$.service.db",
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Omitting this value or sending `NULL` will set keyword to `NULL` because it is a valid keyword which will match all values.",
      optional: true,
    },
    resource: {
      type: "string",
      label: "Number",
      description: "Required if `Number Key` not present.",
      optional: true,
    },
  },
  methods: {
    prepareDate(fieldName) {
      let resources = {};
      if (this.resource) {
        resources = {
          [fieldName]: this.resource,
        };
      } else {
        resources = {
          [`${fieldName}Key`]: this.resourceKey,
        };
      }
      return resources;
    },
    getFieldName() {
      return "number";
    },
  },
  hooks: {
    async activate() {
      const fieldName = this.getFieldName();

      if (((!this.resource) && (!this.resourceKey)) || ((this.resource) && (this.resourceKey))) {
        throw new ConfigurationError(`You must provide either '${fieldName}' or '${fieldName} key'.`);
      }

      const { configurationKey } = await this.infobip.createHook({
        data: {
          keyword: this.keyword,
          channel: this.getChannel(),
          forwarding: {
            type: "HTTP_FORWARD",
            url: this.http.endpoint,
          },
          ...this.prepareDate(fieldName),
        },
      });
      this.db.set("webhookId", configurationKey);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.infobip.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.messageId,
      summary: this.getSummary(body),
      ts: Date.parse(body.receivedAt),
    });
  },
};

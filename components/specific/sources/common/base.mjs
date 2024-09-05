import { ConfigurationError } from "@pipedream/platform";
import { stringifyObject } from "../../common/utils.mjs";
import specific from "../../specific.app.mjs";

export default {
  props: {
    specific,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    code: {
      type: "string",
      label: "Code",
      description: "Webhook's secret code",
      secret: true,
    },
    sourceId: {
      propDefinition: [
        specific,
        "sourceId",
      ],
      type: "string[]",
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.specific.mutation({
        model: "subscribeWebhook",
        data: `{
          code: "${this.code}"
          operation: ["${this.getOperation()}"]
            ${this.sourceId?.length
    ? `sources: ${stringifyObject(this.sourceId)}`
    : ""}
          url: "${this.http.endpoint}"
        }`,
        fields: `
          inactive
          inactiveReason
          operation
          url
        `,
        on: "Webhook",
        onValidationError: true,
      });

      if (data?.subscribeWebhook?.fieldErrors?.length) {
        throw new ConfigurationError(data.subscribeWebhook?.fieldErrors[0].message);
      }

    },
    async deactivate() {
      await this.specific.mutation({
        model: "unsubscribeWebhook",
        where: `{url: "${this.http.endpoint}"}`,
        fields: `
          inactive
          inactiveReason
          operation
          url
        `,
        on: "Webhook",
      });

    },
  },
  async run({
    headers, body,
  }) {
    if (headers["x-code"] != this.code) return;

    const ts = Date.parse(body.insertedAt || new Date());
    this.$emit(body, {
      id: `${body.id || body.workspaceId}-${ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};

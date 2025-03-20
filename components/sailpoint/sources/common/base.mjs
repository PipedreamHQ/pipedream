import sailpoint from "../../sailpoint.app.mjs";

export default {
  props: {
    sailpoint,
    http: "$.interface.http",
    db: "$.service.db",
    name: {
      type: "string",
      label: "Name",
      description: "Subscription name.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Subscription description.",
      optional: true,
    },
    responseDeadline: {
      type: "string",
      label: "Response Deadline",
      description: "Deadline for completing REQUEST_RESPONSE trigger invocation, represented in ISO-8601 duration format.",
      default: "PT1H",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "JSONPath filter to conditionally invoke trigger when expression evaluates to true. **Example: $[?($.identityId == \"201327fda1c44704ac01181e963d463c\")]**. [See the documentation](https://developer.sailpoint.com/docs/extensibility/event-triggers/filtering-events/) for further information.",
      optional: true,
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  hooks: {
    async activate() {
      const response = await this.sailpoint.createWebhook({
        data: {
          name: this.name,
          description: this.description,
          triggerId: this.getTriggerId(),
          type: "HTTP",
          responseDeadline: this.responseDeadline,
          httpConfig: {
            url: this.http.endpoint,
            httpDispatchMode: "ASYNC",
            httpAuthenticationType: "NO_AUTH",
          },
          enabled: true,
          filter: this.filter,
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.sailpoint.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.completed || new Date());
    this.$emit(body, {
      id: `${body.source.id}-${ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};

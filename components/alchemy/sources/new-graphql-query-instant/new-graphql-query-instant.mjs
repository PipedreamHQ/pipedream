import alchemy from "../../alchemy.app.mjs";

export default {
  key: "alchemy-new-graphql-query-instant",
  name: "New GraphQL Query (Instant)",
  description: "Emit new event when a new GraphQL query is uploaded to Alchemy's Custom Webhook service. [See the documentation](https://docs.alchemy.com/reference/create-webhook)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    alchemy,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    network: {
      propDefinition: [
        alchemy,
        "network",
      ],
    },
    query: {
      propDefinition: [
        alchemy,
        "query",
      ],
    },
  },
  hooks: {
    async activate() {
      const { data: { id } } = await this.alchemy.createWebhook({
        data: {
          network: this.network,
          webhook_type: "GRAPHQL",
          webhook_url: this.http.endpoint,
          graphql_query: this.query,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.alchemy.deleteWebhook({
          params: {
            webhook_id: hookId,
          },
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New Event ID: ${body.id}`,
        ts: Date.parse(body.createdAt),
      };
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};

import app from "../../typebot.app.mjs";

export default {
  key: "typebot-zapier-step-triggered",
  name: "New Zapier Step Triggered (Instant)",
  description: "Emit new event when a zapier step is triggered. [See the docs](https://docs.typebot.io/api/subscribe-to-webhook-block)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
    typebotId: {
      propDefinition: [
        app,
        "typebotId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    blockId: {
      propDefinition: [
        app,
        "blockId",
        ({ typebotId }) => ({
          typebotId,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        typebotId,
        blockId,
        http: { endpoint: url },
      } = this;
      await this.app.subscribeToWebhookBlock({
        typebotId,
        blockId,
        data: {
          url,
        },
      });
    },
    async deactivate() {
      const {
        typebotId,
        blockId,
      } = this;
      await this.app.unsubscribeFromWebhookBlock({
        typebotId,
        blockId,
      });
    },
  },
  methods: {
    generateMetadata(resource) {
      const ts = Date.parse(resource.submittedAt);
      return {
        id: ts,
        ts,
        summary: `New Step Submitted at ${resource.submittedAt}`,
      };
    },
  },
  async run({ body }) {
    const meta = this.generateMetadata(body);
    this.$emit(body, meta);
  },
};

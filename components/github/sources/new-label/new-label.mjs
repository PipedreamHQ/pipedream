import common from "../common/common-flex.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#fork";

export default {
  ...common,
  key: "github-new-label",
  name: "New Label",
  description: `Emit new event when a new label is created [See the documentation](${DOCS_LINK})`,
  version: "1.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleTimerEvent() {
      return {
        testTimer: 456,
      };
    },
    getSampleWebhookEvent() {
      return {
        testWebhook: 123,
      };
    },
    getWebhookEvents() {
      return [
        "issues",
      ];
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      if (body?.action === "created") {
        const { label } = body;
        const { id } = label;
        const ts = Date.now();
        const summary = `New label: "${label.name}"`;

        this.$emit(label, {
          id,
          summary,
          ts,
        });
      }
    },
    async onTimerTrigger() {
      const { repoFullname } = this;
      const items = await this.github.getRepositoryLatestLabels({
        repoFullname,
      });

      const savedItems = this._getSavedItems();
      const shouldEmit = savedItems.length > 0;

      items
        .filter(({ id }) => !savedItems.includes(id))
        .forEach((item) => {
          const { id } = item;
          if (shouldEmit) {
            const ts = Date.now();
            const summary = `New label: "${item.name}"`;

            this.$emit(item, {
              id,
              summary,
              ts,
            });
          }
          savedItems.push(id);
        });

      this._setSavedItems(savedItems);
    },
  },
};

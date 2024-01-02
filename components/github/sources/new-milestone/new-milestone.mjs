import common from "../common/common-flex.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#fork";

export default {
  ...common,
  key: "github-new-milestone",
  name: "New Milestone",
  description: `Emit new event when a new milestone is created [See the documentation](${DOCS_LINK})`,
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
        const { milestone } = body;
        const { id } = milestone;
        const ts = Date.now();
        const summary = `New milestone: "${milestone.title}"`;

        this.$emit(milestone, {
          id,
          summary,
          ts,
        });
      }
    },
    async onTimerTrigger() {
      const { repoFullname } = this;
      const items = await this.github.getRepositoryMilestones({
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
            const summary = `New milestone: "${item.title}"`;

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

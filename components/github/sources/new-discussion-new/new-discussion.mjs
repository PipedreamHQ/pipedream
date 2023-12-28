import common from "../common/common.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#discussion";

export default {
  ...common,
  key: "github-new-discussion",
  name: "New Discussion",
  description: `Emit new event when a discussion is created [See the documentation](${DOCS_LINK})`,
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
        "discussion",
      ];
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      if (body?.action === "created") {
        const { discussion } = body;
        const { id } = discussion;
        const ts = Date.now();
        const summary = `New discussion: "${discussion.title}"`;

        this.$emit(discussion, {
          id,
          summary,
          ts,
        });
      }
    },
    async onTimerTrigger() {
      const { repoFullname } = this;
      const items = await this.github.getDiscussions({
        repoFullname,
      });

      const savedItems = this._getSavedItems();
      const shouldEmit = savedItems.length > 0;

      items
        .filter(({ name }) => !savedItems.includes(name))
        .forEach((item) => {
          const { id } = item;
          if (shouldEmit) {
            const ts = Date.now();
            const summary = `New discussion: "${item.title}"`;

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

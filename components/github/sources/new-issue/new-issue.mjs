import common from "../common/common.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#fork";

export default {
  ...common,
  key: "github-new-issue",
  name: "New Issue",
  description: `Emit new event when a new issue is opened [See the documentation](${DOCS_LINK})`,
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
      if (body?.action === "opened") {
        const { issue } = body;
        const { id } = issue;
        const ts = Date.now();
        const summary = `New issue: "${issue.title}"`;

        this.$emit(issue, {
          id,
          summary,
          ts,
        });
      }
    },
    async onTimerTrigger() {
      const { repoFullname } = this;
      const items = await this.github.getRepositoryLatestIssues({
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
            const summary = `New issue: "${item.title}"`;

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

import common from "../common/common.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#commit_comment";

export default {
  ...common,
  key: "github-new-commit-comment",
  name: "New Commit Comment",
  description: `Emit new event when a commit comment is created [See the documentation](${DOCS_LINK})`,
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
        "commit_comment",
      ];
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      if (body?.action === "created") {
        const { comment } = body;
        const { id } = comment;
        const ts = Date.now();
        const summary = `New comment (${id})`;

        this.$emit(comment, {
          id,
          summary,
          ts,
        });
      }
    },
    async onTimerTrigger() {
      const { repoFullname } = this;
      const items = await this.github.getRepositoryLatestCommitComments({
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
            const summary = `New comment (${id})`;

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

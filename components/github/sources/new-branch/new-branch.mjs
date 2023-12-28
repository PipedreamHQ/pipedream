import common from "../common/common.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#create";

export default {
  ...common,
  key: "github-new-branch",
  name: "New Branch",
  description: `Emit new event when a branch is created [See the documentation](${DOCS_LINK})`,
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
        "create",
      ];
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      if (body?.ref_type === "branch") {
        const ts = Date.now();
        const id = body.ref;
        const summary = `New branch: ${id}`;

        this.$emit(body, {
          id,
          summary,
          ts,
        });
      }
    },
    async onTimerTrigger() {
      const { repoFullname } = this;
      const items = await this.github.getBranches({
        repoFullname,
      });

      const savedItems = this._getSavedItems();
      const shouldEmit = savedItems.length > 0;

      items
        .filter(({ name }) => !savedItems.includes(name))
        .forEach((item) => {
          const id = item.name;
          if (shouldEmit) {
            const ts = Date.now();
            const summary = `New branch: "${id}"`;

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

import common from "../common/common-flex.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#member";

export default {
  ...common,
  key: "github-new-collaborator",
  name: "New Collaborator",
  description: `Emit new event when a collaborator is added [See the documentation](${DOCS_LINK})`,
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
        "member",
      ];
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      if (body?.action === "added") {
        const { member } = body;
        const { id } = member;
        const ts = Date.now();
        const summary = `New collaborator: "${member.login}"`;

        this.$emit(member, {
          id,
          summary,
          ts,
        });
      }
    },
    async onTimerTrigger() {
      const { repoFullname } = this;
      const items = await this.github.getRepositoryLatestCollaborators({
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
            const summary = `New collaborator: "${item.login}"`;

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

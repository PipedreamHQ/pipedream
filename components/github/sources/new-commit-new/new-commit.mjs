import common from "../common/common.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#push";

export default {
  ...common,
  key: "github-new-commit",
  name: "New Commit",
  description: `Emit new events when a collaborator is added [See the documentation](${DOCS_LINK})`,
  version: "1.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    branch: {
      propDefinition: [
        common.props.github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    _setLastTimestamp(value) {
      this.db.set("lastTimestamp", value);
    },
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
        "push",
      ];
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      if (body?.ref.split("refs/heads/").pop() === this.branch) {
        body.commits.forEach((commit) => {
          const { id } = commit;
          const ts = Date.now();
          const summary = `New commit: "${commit.message}"`;

          this.$emit(commit, {
            id,
            summary,
            ts,
          });
        });
      }
    },
    async onTimerTrigger() {
      const { repoFullname } = this;
      const ts = Date.now();
      const timestamp = this._getLastTimestamp();
      const items = await this.github.getCommits({
        repoFullname,
        ...(timestamp && {
          since: new Date(timestamp).toISOString()
            .slice(0, -5) + "Z",
        }),
      });

      const savedItems = this._getSavedItems();
      const shouldEmit = savedItems.length > 0;

      items
        .filter(({ sha }) => !savedItems.includes(sha))
        .forEach((item) => {
          const id = item.sha;
          if (shouldEmit) {
            const summary = `New commit: "${item.commit.message}"`;

            this.$emit(item, {
              id,
              summary,
              ts,
            });
          }
          savedItems.push(id);
        });

      this._setSavedItems(savedItems);
      this._setLastTimestamp(ts);
    },
  },
};

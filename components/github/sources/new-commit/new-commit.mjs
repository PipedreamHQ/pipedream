import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./sample-events.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#push";

export default {
  ...common,
  key: "github-new-commit",
  name: "New Commit",
  description: `Emit new event when commits are pushed to a branch [See the documentation](${DOCS_LINK})`,
  version: "1.1.{{ts}}",
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
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "push",
      ];
    },
    getSummary(item) {
      return `New commit: ${item.commit?.message ?? item.message}`;
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      if (body?.ref?.split?.("refs/heads/").pop() === this.branch.split("/").pop()) {
        body.commits.forEach((commit) => {
          const { id } = commit;
          this.emitEvent({
            id,
            item: commit,
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
        sha: this.branch.split("/")[0],
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
            this.emitEvent({
              id,
              item,
            });
          }
          savedItems.push(id);
        });

      this._setSavedItems(savedItems);
      this._setLastTimestamp(ts);
    },
  },
};

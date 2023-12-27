import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads#pull_request";

export default {
  ...common,
  key: "github-new-or-updated-pull-request",
  name: "New or Updated Pull Request",
  description: `Emit new events when a pull request is opened or updated [See the documentation](${DOCS_LINK})`,
  version: "1.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHttpAdditionalProps() {
      return {
        eventTypes: {
          type: "string[]",
          label: "Filter Event Types",
          description: `Specify the types of pull request activity that should emit events. [See the documentation](${DOCS_LINK}) for more information on each type. By default, events will be emitted for all activity.`,
          options: constants.EVENT_TYPES_PULL_REQUEST,
          optional: true,
        },
      };
    },
    getTimerAdditionalProps() {
      return {
        emitUpdates: {
          type: "boolean",
          label: "Emit Updates",
          description:
            "If `false`, events will only be emitted when a new pull request is created. [See the documentation](https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-pull-requests) for more information.",
          default: true,
          optional: true,
        },
      };
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
        "pull_request",
      ];
    },
    checkEventType(type) {
      return !this.eventTypes || this.eventTypes.includes(type);
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      const action = body?.action;
      if (action && this.checkEventType(action)) {
        const ts = Date.now();
        const id = `${action}_${ts}`;
        const summary = `PR activity (${action}): "${body.pull_request.title}"`;

        this.$emit(body, {
          id,
          summary,
          ts,
        });
      }
    },
    async onTimerTrigger() {
      const {
        emitUpdates, repoFullname,
      } = this;
      const sort = emitUpdates === false
        ? "created"
        : "updated";
      const items = await this.github.getRepositoryLatestPullRequests({
        repoFullname,
        sort,
      });

      const savedItems = this._getSavedItems();
      const tsProp = emitUpdates === false
        ? "created_at"
        : "updated_at";
      const getFullId = (item) => `${item.id}_${item[tsProp]}`;
      const idsToStore = items.map(getFullId);

      if (savedItems.length) {
        const firstCachedIndex = idsToStore.findIndex((id) =>
          savedItems.includes(id));
        const filteredItems =
          firstCachedIndex === -1
            ? items
            : items.slice(0, firstCachedIndex);

        filteredItems.reverse().forEach((item) => {
          const ts = new Date(item[tsProp]).valueOf();
          const summary = `PR ${sort}: "${item.title}"`;

          this.$emit(item, {
            id: getFullId(item),
            summary,
            ts,
          });
        });
      }

      this._setSavedItems(idsToStore);
    },
  },
};

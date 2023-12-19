import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import github from "../../github.app.mjs";
import commonWebhook from "../common/common-webhook.mjs";
import constants from "../common/constants.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads#pull_request";

export default {
  key: "github-new-or-updated-pull-request",
  name: "New or Updated Pull Request",
  description: `Emit new events when a pull request is opened or updated [See the documentation](${DOCS_LINK})`,
  version: "1.0.0",
  type: "source",
  dedupe: "last",
  props: {
    github,
    db: "$.service.db",
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};

    if (await this.checkAdminPermission()) {
      props.http = {
        type: "$.interface.http",
      };
      props.eventTypes = {
        type: "string[]",
        label: "Filter Event Types",
        description: `Specify the types of pull request activity that should emit events. [See the documentation](${DOCS_LINK}) for more information on each type. By default, events will be emitted for all activity.`,
        options: constants.EVENT_TYPES_PULL_REQUEST,
        optional: true,
      };
    } else {
      props.timer = {
        type: "$.interface.timer",
        default: {
          intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
        },
      };
      props.emitUpdates = {
        type: "boolean",
        label: "Emit Updates",
        description:
          "If `false`, events will only be emitted when a new pull request is created. [See the documentation](https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-pull-requests) for more information.",
        default: true,
        optional: true,
      };
    }

    return props;
  },
  methods: {
    ...commonWebhook.methods,
    getPrCache() {
      return this.db.get("prCache") ?? [];
    },
    setPrCache(value) {
      this.db.set("prCache", value);
    },
    getWebhookEvents() {
      return [
        "pull_request",
      ];
    },
    async checkAdminPermission() {
      const { repoFullname } = this;
      const { login: username } = await this.github.getAuthenticatedUser();
      const { user: { permissions: { admin } } } = await this.github.getUserRepoPermissions({
        repoFullname,
        username,
      });
      return admin;
    },
    async checkWebhookCreation() {
      const admin = await this.checkAdminPermission();
      if (admin) {
        await this.createWebhook();
      } else await this.removeWebhook();
    },
    checkEventType(type) {
      const { eventTypes } = this;
      if (eventTypes) {
        return typeof eventTypes === "string"
          ? eventTypes === type
          : eventTypes.includes(type);
      }

      return true;
    },
  },
  hooks: {
    async activate() {
      await this.checkWebhookCreation();
    },
    async deactivate() {
      await this.removeWebhook();
    },
  },
  async run(event) {
    // Http (webhook)
    if (this._getWebhookId()) {
      const { body } = event;
      const action = body?.action;
      // Confirm this is a webhook event (discard timer triggers)
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
    }

    // Timer (polling)
    else {
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

      const cache = this.getPrCache();
      const tsProp = emitUpdates === false
        ? "created_at"
        : "updated_at";
      const getFullId = (item) => `${item.id}_${item[tsProp]}`;
      const idsToStore = items.map(getFullId);
      const firstCachedIndex = idsToStore.findIndex((id) => cache.includes(id));
      const filteredItems =
        firstCachedIndex === -1
          ? items
          : items.slice(0, firstCachedIndex);

      this.setPrCache(idsToStore);

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
  },
};

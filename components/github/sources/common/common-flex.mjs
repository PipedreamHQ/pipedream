import github from "../../github.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
      reloadProps: true,
    },
    db: "$.service.db",
  },
  async additionalProps() {
    if (await this.checkAdminPermission()) {
      return {
        http: {
          type: "$.interface.http",
        },
        ...this.getHttpAdditionalProps(),
      };
    } else {
      return {
        timer: {
          type: "$.interface.timer",
          default: {
            intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
          },
        },
        ...this.getTimerAdditionalProps(),
      };
    }
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getSavedItems() {
      const items = this.db.get("savedItems");
      return items?.length > 1000
        ? items.slice(500)
        : (items ?? []);
    },
    _setSavedItems(value) {
      this.db.set("savedItems", value);
    },
    getHttpAdditionalProps() {
      return {};
    },
    getTimerAdditionalProps() {
      return {};
    },
    getWebhookEvents() {
      throw new Error("getWebhookEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    loadHistoricalEvents() {
      return true;
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
        this.$emit(this.getSampleWebhookEvent(), {
          id: "sample_webhook_event",
          summary: "Sample Webhook Event",
          ts: Date.now(),
        });
      } else {
        await this.removeWebhook();
        this.$emit(this.getSampleTimerEvent(), {
          id: "sample_timer_event",
          summary: "Sample Timer Event",
          ts: Date.now(),
        });
      }
    },
    async createWebhook() {
      if (this._getWebhookId()) {
        await this.removeWebhook();
      }
      const response = await this.github.createWebhook({
        repoFullname: this.repoFullname,
        data: {
          name: "web",
          config: {
            url: this.http.endpoint,
            content_type: "json",
          },
          events: this.getWebhookEvents(),
        },
      });
      this._setWebhookId(response.id);
    },
    async removeWebhook(webhookId = this._getWebhookId()) {
      if (webhookId) {
        await this.github.removeWebhook({
          repoFullname: this.repoFullname,
          webhookId,
        });
        this._setWebhookId(null);
      }
    },
    shouldEmitWebhookEvent() {
      return true;
    },
    getId(item) {
      return item.id ?? Date.now();
    },
    getWebhookEventItem(body) {
      return body;
    },
    getSummary() {
      return "New event";
    },
    emitEvent({
      id, item,
    }) {
      const ts = Date.now();
      const summary = this.getSummary(item);
      this.$emit(item, {
        id,
        summary,
        ts,
      });
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      if (this.shouldEmitWebhookEvent(body)) {
        const item = this._getWebhookEventItem(body);
        const id = this.getId(item);
        this.emitEvent({
          id,
          item,
        });
      }
    },
    async onTimerTrigger() {
      const { repoFullname } = this;
      const items = await this.getPollingData({
        repoFullname,
      });

      const savedItems = this._getSavedItems();
      const shouldEmit = savedItems.length > 0;

      items
        .filter(({ name }) => !savedItems.includes(name))
        .forEach((item) => {
          const id = this.getId(item);
          if (shouldEmit) {
            this.emitEvent({
              id,
              item,
            });
          }
          savedItems.push(id);
        });

      this._setSavedItems(savedItems);
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
    if (this._getWebhookId()) {
      console.log("webhook trigger");
      await this.onWebhookTrigger(event);
    }

    else {
      console.log("timer trigger");
      await this.onTimerTrigger();
    }
  },
};

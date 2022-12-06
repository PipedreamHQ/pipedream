import bitbucket from "../../bitbucket.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
export default {
  props: {
    bitbucket,
    workspaceId: {
      propDefinition: [
        bitbucket,
        "workspace",
      ],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getWebhookId(index = undefined) {
      return this.db.get(`webhookId${index
        ? index
        : ""}`);
    },
    _setWebhookId(webhookId, index = undefined) {
      this.db.set(`webhookId${index
        ? index
        : ""}`, webhookId);
    },
    getPath() {
      return `workspaces/${this.workspaceId}/hooks`;
    },
    getWebhookEventTypes() {
      throw new Error("getWebhookEventTypes is not implemented");
    },
    proccessEvent(event) {
      throw new Error("proccessEvent is not implemented", event);
    },
    getTotalRepositories() {
      return this.db.get("repositoryCount");
    },
    setTotalRepositories(total) {
      return this.db.set("repositoryCount", total);
    },
    async createWebHook(path, events) {
      return this.bitbucket.createWebhook({
        path,
        workspaceId: this.workspaceId,
        url: this.http.endpoint,
        events,
      });
    },
    async deactivateMain(path, index = undefined) {
      const webhookId = this._getWebhookId(index);
      return this.bitbucket.removeWebhook({
        path,
        webhookId,
      });
    },
    async hookArrayPath(path, events) {
      const pathsPromise = path.map((item) => this.createWebHook(item, events));
      const paths = await Promise.all(pathsPromise);
      this.setTotalRepositories(paths.length);
      paths.forEach((response, index) => this._setWebhookId(response.uuid, index + 1));
    },
    async hookStringPath(path, events) {
      this.setTotalRepositories(1);
      const response = await this.createWebHook(path, events);
      this._setWebhookId(response.uuid);
    },
    async loadHistoricalData() {
      console.log("No historical data for this event");
    },
  },
  hooks: {
    async deploy() {
      // Retrieve historical events
      const events = await this.loadHistoricalData();
      if (events) {
        for (const event of events) {
          this.$emit(event.main, event.sub);
        }
      }

    },
    async activate() {
      const path = this.getPath();
      const events = this.getWebhookEventTypes();
      if (!events || (Array.isArray(events) && events.length === 0)) {
        throw new ConfigurationError("You need to select at least one event.");
      }
      if (!path || (Array.isArray(path) && path.length === 0)) {
        throw new ConfigurationError("You need to select at least one repository.");
      }
      if (Array.isArray(path) && path.length > 1) {
        await this.hookArrayPath(path, events);
      } else if (typeof path === "string") {
        await this.hookStringPath(path, events);
      }
    },
    async deactivate() {
      const repositoryCount = this.getTotalRepositories();
      const path = this.getPath();
      if (repositoryCount === 1) {
        await this.deactivateMain(path);
      } else if (repositoryCount > 1) {
        const pathsPromise = path.map((item, index) => this.deactivateMain(item, index + 1));
        await Promise.all(pathsPromise);
      }
    },
  },
  async run(event) {
    this.proccessEvent(event);
  },
};

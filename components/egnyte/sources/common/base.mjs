import egnyte from "../../egnyte.app.mjs";

export default {
  props: {
    egnyte,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    folderPaths: {
      type: "string[]",
      label: "Folder Paths",
      description: "An array of folder paths (example: `/Shared/Documents`) to watch for updates. You may specify up to 100 paths.",
    },
  },
  hooks: {
    async activate() {
      const { webhookId } = await this.egnyte.createWebhook({
        data: {
          url: this.http.endpoint,
          eventType: this.getEventType(),
          path: this.folderPaths.join(","),
        },
      });
      this._setHookId(webhookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.egnyte.deleteWebhook({
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    if (!body || !body?.length) {
      return;
    }

    for (const item of body) {
      const meta = this.generateMeta(item); console.log(meta);
      this.$emit(item, meta);
    }
  },
};

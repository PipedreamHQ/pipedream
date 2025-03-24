import autodesk from "../../autodesk.app.mjs";

export default {
  props: {
    autodesk,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    hubId: {
      propDefinition: [
        autodesk,
        "hubId",
      ],
    },
    projectId: {
      propDefinition: [
        autodesk,
        "projectId",
        (c) => ({
          hubId: c.hubId,
        }),
      ],
    },
    folderId: {
      propDefinition: [
        autodesk,
        "folderId",
        (c) => ({
          hubId: c.hubId,
          projectId: c.projectId,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      const { headers: { location } } = await this.autodesk.createWebhook({
        system: "data",
        event: this.getEvent(),
        data: {
          callbackUrl: this.http.endpoint,
          scope: {
            folder: this.folderId,
          },
          hubId: this.hubId,
          projectId: this.projectId,
          autoReactivateHook: true,
        },
        returnFullResponse: true,
      });
      if (!location) {
        throw new Error("Could not create webhook");
      }
      const hookId = location.split("/").pop();
      this._setHookId(hookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.autodesk.deleteWebhook({
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
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body: { payload } } = event;
    if (!payload) {
      return;
    }

    const meta = this.generateMeta(payload);
    this.$emit(payload, meta);
  },
};

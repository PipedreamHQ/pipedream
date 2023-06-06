import smartsheet from "../../smartsheet.app.mjs";

export default {
  props: {
    smartsheet,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    sheetId: {
      propDefinition: [
        smartsheet,
        "sheetId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { result: { id } } = await this.smartsheet.createWebhook({
        data: {
          callbackUrl: this.http.endpoint,
          events: [
            "*.*",
          ],
          name: this.getWebhookName(),
          version: 1,
          scopeObjectId: this.sheetId,
          scope: "sheet",
        },
      });

      this._setHookId(id);

      await this.smartsheet.updateWebhook(id, {
        data: {
          enabled: true,
        },
      });
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.smartsheet.deleteWebhook(hookId);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getWebhookName() {
      throw new Error("getWebhookName is not implemented");
    },
    isRelevant() {
      throw new Error("isRelevant is not implemented");
    },
    getResource() {
      throw new Error("getResource is not implemented");
    },
  },
  async run(event) {
    const { body } = event;

    if (body.challenge) {
      this.http.respond({
        status: 200,
        body: {
          smartsheetHookResponse: body.challenge,
        },
      });
      return;
    }

    const { events } = body;

    for (const event of events) {
      if (this.isRelevant(event)) {
        const meta = this.generateMeta(event);
        const resource = await this.getResource(event);
        this.$emit({
          event,
          resource,
        }, meta);
      }
    }
  },
};

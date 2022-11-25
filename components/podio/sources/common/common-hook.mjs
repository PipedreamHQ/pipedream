import app from "../../podio.app.mjs";

export default {
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getHookID() {
      return this.db.get("hookId");
    },
    _setHookID(hookId) {
      this.db.set("hookId", hookId);
    },
    getRefType() {
      throw new Error("getRefType() is not implemented!");
    },
    getRefId() {
      throw new Error("getRefId() is not implemented!");
    },
    getEvent() {
      throw new Error("getEvent() is not implemented!");
    },
    getMeta() {
      throw new Error("getMeta() is not implemented!");
    },
    async getData() {
      throw new Error("getData() is not implemented!");
    },
  },
  hooks: {
    async activate() {
      const resp = await this.app.createWebhook({
        refType: this.getRefType(),
        refId: this.getRefId(),
        data: {
          type: this.getEvent(),
          url: this.http.endpoint,
        },
      });
      this._setHookID(resp.hook_id);
      await this.app.requestWebhookVerification({
        hookId: resp.hook_id,
      });
      console.log(`Created webhook. (Hook ID: ${resp.hook_id}, endpoint: ${this.http.endpoint})`);
    },
    async deactivate() {
      await this.app.deleteWebhook({
        hookId: this._getHookID(),
      });
    },
  },
  async run(event) {
    if (event.body.type == "hook.verify") {
      await this.app.validateWebhook({
        hookId: event.body.hook_id,
        data: {
          code: event.body.code,
        },
      });
    } else {
      this.http.respond({
        status: 202,
      });
      const data = await this.getData(event);
      this.$emit(
        {
          event,
          data,
        },
        this.getMeta(event),
      );
    }
  },
};

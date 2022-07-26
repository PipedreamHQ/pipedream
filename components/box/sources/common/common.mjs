import app from "../../box.app.mjs";

export default {
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    webhookTarget: {
      propDefinition: [
        app,
        "webhookTarget",
      ],
    },
  },
  methods: {
    _getHookID() {
      return this.db.get("hookId");
    },
    _setHookID(hookID) {
      this.db.set("hookId", hookID);
    },
    getTarget() {
      return JSON.parse(this.webhookTarget);
    },
    getTriggers() {
      throw new Error("getTriggers() is not implemented!");
    },
    getSummary() {
      throw new Error("getSummary(event) is not implemented!");
    },
  },
  hooks: {
    async activate() {
      const {
        id,
        target,
        triggers,
      } = await this.app.createHook({
        data: {
          address: this.http.endpoint,
          triggers: this.getTriggers(),
          target: this.getTarget(),
        },
      });
      this._setHookID(id);
      console.log(`Created webhook. (Hook ID: ${id}, endpoint: ${this.http.endpoint}), target ID:${target.id}, triggers: ${triggers}`);
    },
    async deactivate() {
      await this.app.deleteHook({
        hookId: this._getHookID(),
      });
    },
  },
  async run(event) {
    this.$emit(
      {
        event,
        [event.body.source?.type]: event.body.source,
      },
      {
        id: event.body.id,
        summary: this.getSummary(event.body),
        ts: event.body.created_at ?
          new Date(event.body.created_at).getTime() :
          Date.now(),
      },
    );
  },
};

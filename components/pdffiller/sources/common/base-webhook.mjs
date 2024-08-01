import pdffiller from "../../pdffiller.app.mjs";

export default {
  props: {
    pdffiller,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    fillableFormId: {
      propDefinition: [
        pdffiller,
        "fillableFormId",
      ],
    },
  },
  methods: {
    _setCallbackId(callbackId) {
      this.db.set("callbackId", callbackId);
    },
    _getCallbackId() {
      return this.db.get("callbackId");
    },
  },
  hooks: {
    async activate() {
      const data = await this.pdffiller.createCallback({
        data: {
          document_id: this.fillableFormId,
          event_id: this.getEventId(),
          callback_url: this.http.endpoint,
        },
      });
      this._setCallbackId(data.id);
    },
    async deactivate() {
      const callbackId = this._getCallbackId();
      await this.pdffiller.deleteCallback(callbackId);
    },
  },
  async run({ body }) {
    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.resource}-${ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};

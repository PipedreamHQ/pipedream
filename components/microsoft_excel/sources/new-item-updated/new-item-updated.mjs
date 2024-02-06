import moment from "moment";
import microsoftExcel from "../../microsoft_excel.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  dedupe: "unique",
  key: "microsoft_excel-new-item-updated",
  name: "New Item Updated (Instant)",
  description: "Emit new event when an item is updated.",
  version: "0.0.2",
  type: "source",
  props: {
    microsoftExcel,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const response = await this.microsoftExcel.createHook({
        data: {
          changeType: "updated",
          notificationUrl: this.http.endpoint,
          resource: "me/drive/root",
          expirationDateTime: moment().add(30, "days"),
        },
      });

      this._setHookId(response.id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.microsoftExcel.deleteHook(id);
    },
  },
  methods: {
    emitEvent(body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(body) {
      const { value } = body;

      const ts = new Date();
      return {
        id: `${value[0].tenantId}${ts}`,
        summary: `The item ${value[0].tenantId
          ? `with TenantId: ${value[0].tenantId} `
          : " "}was updated!`,
        ts: ts,
      };
    },
    async updateSubscription() {
      const hookId = this._getHookId();
      await this.microsoftExcel.updateSubscription({
        hookId,
        data: {
          expirationDateTime: moment().add(30, "days"),
        },
      });
    },
  },
  async run({
    body, query,
  }) {
    if (query.validationToken) {
      this.http.respond({
        status: 200,
        body: query.validationToken,
        headers: {
          "content-type": "text/plan",
        },
      });
      return;
    }

    this.emitEvent(body);
    await this.updateSubscription();
  },
  sampleEmit,
};

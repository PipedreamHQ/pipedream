import zohoForms from "../../zoho_forms.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "zoho_forms-new-response-received-instant",
  name: "New Response Received (Instant)",
  description: "Emit new event when a specific form receive a new response.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    zohoForms,
    db: "$.service.db",
    http: "$.interface.http",
    formLinkName: {
      propDefinition: [
        zohoForms,
        "formLinkName",
      ],
    },
  },
  methods: {
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getHookId() {
      return this.db.get("hookId");
    },
  },
  hooks: {
    async activate() {
      const response = await this.zohoForms.createHook({
        params: {
          "webhooks_url": this.http.endpoint,
          "formlinkname": this.formLinkName,
        },
      });

      this.setHookId(response.webhook_id);
    },
    async deactivate() {
      await this.zohoForms.deleteHook({
        params: {
          "webhook_id": this.getHookId(),
          "formlinkname": this.formLinkName,
        },
      });
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.ADDED_TIME_ISO8601);

    this.$emit(body, {
      id: body.IP_ADDRESS + ts,
      summary: "New response received",
      ts: ts,
    });
  },
  sampleEmit,
};

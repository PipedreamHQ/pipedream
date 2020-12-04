const formstack = require("../../formstack.app.js");
const get = require("lodash.get");

module.exports = {
  key: "formstack-new-form-submission",
  name: "New Form Submission (Instant)",
  description: "Emits an event for each new form submission.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    formstack,
    db: "$.service.db",
    http: "$.interface.http",
    formId: { propDefinition: [formstack, "formId"] },
  },
  hooks: {
    async activate() {
      const { id } = await this.formstack.createHook({
        id: this.formId,
        url: this.http.endpoint,
      });
      this.db.set("hookId", id);
    },
    async deactivate() {
      await this.formstack.deleteHook({
        hookId: this.db.get("hookId"),
      });
    },
  },
  async run(event) {
    const body = get(event, "body");
    if (!body) {
      return;
    }

    // verify incoming request
    if (
      this.formstack.$auth.oauth_refresh_token !== get(body, "HandshakeKey")
    ) {
      console.log("HandshakeKey mismatch. Exiting.");
      return;
    }

    const uniqueID = get(body, "UniqueID");
    if (!uniqueID) return;
    delete body.HandshakeKey;
    this.$emit(body, {
      id: body.UniqueID,
      summary: `New Form Submission ${body.UniqueID}`,
      ts: Date.now(),
    });
  },
};
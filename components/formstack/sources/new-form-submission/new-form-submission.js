const formstack = require("../../formstack.app.js");
const get = require("lodash.get");

module.exports = {
  key: "formstack-new-form-submission",
  name: "New Form Submission (Instant)",
  description: "Emits an event for each new form submission.",
  version: "0.0.1",
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
      })
      this.db.set("hookId", id);  
      this.db.set("handshake_key", this.formstack.$auth.oauth_refresh_token);
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
    if (this.db.get("handshake_key") !== get(body, "HandshakeKey"))
      return;

    const uniqueID = get(body, "UniqueID");
    if (!uniqueID) return;
    this.$emit(body, {
      id: body.UniqueID,
      summary: "New Form Submission",
      ts: Date.now(),
    });
  },
};

const formstack = require("../../formstack.app.js");

module.exports = {
  key: "formstack-new-form",
  name: "New Form (Instant)",
  description: "Emits an event for each new form added.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    formstack,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run() {
    const formIds = this.db.get("formIds") || [];
    const forms = await this.formstack.getForms();
    for (const form of forms) {
      if (!formIds.includes(form.id)) {
        this.$emit(form, {
          id: form.id,
          summary: form.name,
          ts: Date.now(),
        });
        formIds.push(form.id);
      }
    }
    this.db.set("formIds", formIds);
  },
};

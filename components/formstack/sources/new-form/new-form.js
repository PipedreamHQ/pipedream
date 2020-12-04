const formstack = require("../../formstack.app.js");

module.exports = {
  key: "formstack-new-form",
  name: "New Form",
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
    const largestPreviousFormId = this.db.get("largestPreviousFormId") || 0;
    let largestFormId = 0;
    let forms = [];
    let page = 1;
    const per_page = 100;
    let total = per_page;
    while (total === per_page) {
      const results = await this.formstack.getForms(page, per_page);
      total = results.length;
      forms = forms.concat(results);
      page++;
    }
    for (const form of forms) {
      if (form.id > largestPreviousFormId) {
        this.$emit(form, {
          id: form.id,
          summary: form.name,
          ts: Date.now(),
        });
        largestFormId = form.id;
      }
    }
    if (largestFormId > 0) this.db.set("largestPreviousFormId", largestFormId);
  },
};
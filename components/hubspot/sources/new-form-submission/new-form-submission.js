const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-form-submission",
  name: "New Form Submission",
  description: "Emits an event for each new submission of a form.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    forms: {
      type: "string[]",
      label: "Form",
      optional: false,
      async options() {
        const results = await this.hubspot.getForms();
        const options = results.map((result) => {
          const label = result.name;
          return {
            label,
            value: JSON.stringify({ label, value: result.guid }),
          };
        });
        return options;
      },
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    generateMeta(form, result, submittedAt) {
      return {
        id: `${form.value}${result.submittedAt}`,
        summary: `${
          form.label
        } submitted at ${submittedAt.toLocaleDateString()} ${submittedAt.toLocaleTimeString()}`,
        ts: result.submittedAt,
      };
    },
  },
  async run(event) {
    const lastRun = this.db.get("submittedAfter") || this.hubspot.monthAgo();
    const submittedAfter = new Date(lastRun);

    const results = await this.hubspot.getFormSubmissions(this.forms, submittedAfter.getTime());
    for (const result of results) {
      let submittedAt = new Date(result.submittedAt);
      this.$emit(result, this.generateMeta(result.form, result, submittedAt));
    }

    this.db.set("submittedAfter", Date.now());
  },
};
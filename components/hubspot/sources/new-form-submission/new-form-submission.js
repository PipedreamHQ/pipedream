const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-form-submission",
  name: "New Form Submission",
  description: "Emits an event for each new submission of a form.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    forms: { propDefinition: [common.props.hubspot, "forms"] },
  },
  methods: {
    ...common.methods,
    generateMeta(result) {
      const { pageUrl, submittedAt: ts } = result;
      const submitted = new Date(ts);
      return {
        id: `${pageUrl}${ts}`,
        summary: `Form submitted at ${submitted.toLocaleDateString()} ${submitted.toLocaleTimeString()}`,
        ts,
      };
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
    isRelevant(result, submittedAfter) {
      return result.submittedAt > submittedAfter;
    },
  },
  async run(event) {
    const submittedAfter =
      this.db.get("submittedAfter") || Date.parse(this.hubspot.monthAgo());
    const params = {
      limit: 50,
    };
    for (let form of this.forms) {
      form = JSON.parse(form);
      params.formId = form.value;
      await this.paginate(
        params,
        this.hubspot.getFormSubmissions.bind(this),
        "results",
        submittedAfter
      );
    }

    this.db.set("submittedAfter", Date.now());
  },
};
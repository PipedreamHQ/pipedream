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
      async options({ page, prevContext }) {
        const params = {
          limit: 50,
          offset: prevContext || 0,
        };
        const results = await this.hubspot.getForms(params);
        const options = results.map((result) => {
          const label = result.name;
          return {
            label,
            value: JSON.stringify({ label, value: result.guid }),
          };
        });
        let offset = params.offset + params.limit;
        return {
          options,
          context: { offset },
        };
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
    const params = {
      limit: 50,
    };

    for (let form of this.forms) {
      form = JSON.parse(form);
      let results = null;
      let done = false;
      while ((!results || params.after != undefined) && !done) {
        results = await this.hubspot.getFormSubmissions(form.value, params);
        console.log(results);
        for (const result of results.results) {
          let submittedAt = new Date(result.submittedAt);
          if (submittedAt.getTime() > submittedAfter.getTime()) {
            this.$emit(result, this.generateMeta(form, result, submittedAt));
          } else {
            done = true; // don't need to continue if we've gotten to submissions already evaluated
          }
        }
        if (results.paging) params.after = results.paging.next.after;
        else delete params.after;
      }
      delete params.after;
    }

    this.db.set("submittedAfter", Date.now());
  },
};
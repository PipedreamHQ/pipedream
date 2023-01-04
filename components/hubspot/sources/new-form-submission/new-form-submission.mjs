import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event for each new submission of a form.",
  version: "0.0.12",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    forms: {
      propDefinition: [
        common.props.hubspot,
        "forms",
      ],
      withLabel: false,
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(result) {
      const {
        pageUrl,
        submittedAt: ts,
      } = result;
      const submitted = new Date(ts);
      const id = pageUrl.split("/").pop();
      return {
        id: `${id}${ts}`,
        summary: `Form submitted at ${submitted.toLocaleDateString()} ${submitted.toLocaleTimeString()}`,
        ts,
      };
    },
    isRelevant(result, submittedAfter) {
      const relevant = result.submittedAt > submittedAfter;
      if (relevant) {
        this.updateAfter(result.submittedAt);
      }
      return relevant;
    },
    updateAfter(submittedAt) {
      const after = this._getAfter();
      if (submittedAt > after) {
        this._setAfter(submittedAt);
      }
    },
    getParams() {
      return {
        limit: 50,
      };
    },
    async processResults(after, baseParams) {
      await Promise.all(
        this.forms
          .map((form) => ({
            ...baseParams,
            formId: form,
          }))
          .map((params) =>
            this.paginate(
              params,
              this.hubspot.getFormSubmissions.bind(this),
              "results",
              after,
            )),
      );
    },
  },
};

import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event for each new submission of a form.",
  version: "0.0.53",
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
  methods: {
    ...common.methods,
    getTs(result) {
      return result.submittedAt;
    },
    generateMeta(result) {
      const {
        pageUrl, conversionId,
      } = result;
      const ts = this.getTs(result);
      const submitted = new Date(ts);
      // API submissions have no pageUrl
      const id = pageUrl?.split("/").pop() || conversionId;
      return {
        id: `${id}${ts}`,
        summary: `Form submitted at ${submitted.toLocaleDateString()} ${submitted.toLocaleTimeString()}`,
        ts,
      };
    },
    isRelevant(result, submittedAfter) {
      return this.getTs(result) > submittedAfter;
    },
    getParams() {
      return {
        params: {
          limit: 50,
        },
      };
    },
    async fetchFormDefinition(formId) {
      try {
        return await this.hubspot.getFormDefinition({
          formId,
        });
      } catch (err) {
        console.warn(`Failed to fetch form definition ${formId}: ${err.message}`);
        return null;
      }
    },
    async processResults(after, baseParams) {
      const passes = await Promise.all(this.forms.map((formId) => {
        let form;
        return this.paginatePass(
          {
            ...baseParams,
            formId,
          },
          async (opts) => {
            const page = await this.hubspot.getFormSubmissions(opts);
            if (page.results?.length && form === undefined) {
              form = await this.fetchFormDefinition(formId);
            }
            return {
              ...page,
              results: page.results?.map((result) => ({
                form,
                ...result,
              })),
            };
          },
          "results",
          after,
          formId,
        );
      }));
      // Move the cursor only once every form's pass has completed.
      if (!passes.includes(null)) {
        const newest = Math.max(after || 0, ...passes);
        if (newest > (after || 0)) {
          this._setAfter(newest);
        }
      }
    },
  },
  sampleEmit,
};

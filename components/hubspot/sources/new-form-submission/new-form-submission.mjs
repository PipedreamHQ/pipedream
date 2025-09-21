import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event for each new submission of a form.",
  version: "0.0.38",
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
    async paginate(params, resourceFn, resultType = null, after = null) {
      let results = null;
      let maxTs = after || 0;
      while (!results || params.after) {
        results = await resourceFn(params);
        if (results.paging) {
          params.after = results.paging.next.after;
        } else {
          delete params.after;
        }
        if (resultType) {
          results = results[resultType];
        }

        for (const result of results) {
          if (await this.isRelevant(result, after)) {
            const form = await this.hubspot.getFormDefinition({
              formId: params.formId,
            });
            this.emitEvent({
              form,
              ...result,
            });
            const ts = this.getTs(result);
            if (ts > maxTs) {
              maxTs = ts;
              this._setAfter(ts);
            }
          } else {
            return;
          }
        }
      }
    },
    getTs(result) {
      return result.submittedAt;
    },
    generateMeta(result) {
      const { pageUrl } = result;
      const ts = this.getTs(result);
      const submitted = new Date(ts);
      const id = pageUrl.split("/").pop();
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
  sampleEmit,
};

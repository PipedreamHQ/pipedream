import base from "../common/base.mjs";

export default {
  ...base,
  key: "google_forms-new-comment-answer",
  name: "New Form Answer",
  description: "Emit new event when the form is answered. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms.responses/list)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    generateMeta(response) {
      return {
        id: response.responseId,
        summary: "New Answer",
        ts: new Date(response.createdTime).getTime(),
      };
    },
  },
  async run({ $ }) {
    const lastSubmittedTime = this.getLastSubmittedTime();
    const { responses } = await this.googleForms.listFormResponses({
      formId: this.formId,
      $,
      params: {
        filter: lastSubmittedTime && `timestamp >= ${lastSubmittedTime}`,
      },
    });
    if (!responses || !Array.isArray(responses)) {
      return;
    }
    const responseSorted = this.sortResponses(responses);
    this.setLastSubmittedTime(
      responseSorted.length && responseSorted[0].lastSubmittedTime,
    );
    this.emitResponses(responseSorted.reverse());
  },
};

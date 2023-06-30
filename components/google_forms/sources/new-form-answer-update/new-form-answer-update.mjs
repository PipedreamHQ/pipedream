import base from "../common/base.mjs";

export default {
  ...base,
  key: "google_forms-new-form-answer-update",
  name: "New Form Answer Update",
  description: "Emit a new event when an answer is sent or updated. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms.responses/list)",
  version: "0.0.1",
  dedupe: "last",
  type: "source",
  methods: {
    ...base.methods,
    generateMeta(response) {
      console.log(response);
      return {
        id: new Date(response.lastSubmittedTime).getTime(),
        summary: "New Answer Update",
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

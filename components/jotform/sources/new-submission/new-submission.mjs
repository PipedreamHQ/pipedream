import jotform from "../../jotform.app.mjs";

export default {
  key: "jotform-new-submission",
  name: "New Submission (Instant)",
  description: "Emit new event when a form is submitted",
  version: "0.0.5",
  type: "source",
  props: {
    jotform,
    formId: {
      propDefinition: [
        jotform,
        "formId",
      ],
    },
    http: "$.interface.http",
  },
  dedupe: "unique",
  hooks: {
    async activate() {
      return (await this.jotform.createHook({
        endpoint: this.http.endpoint,
        formId: this.formId,
      }));
    },
    async deactivate() {
      return (await this.jotform.deleteHook({
        endpoint: this.http.endpoint,
        formId: this.formId,
      }));
    },
  },
  async run(event) {
    const { body } = event;
    body.formData = JSON.parse(body.rawRequest);

    this.$emit(body, {
      summary: body.formTitle || JSON.stringify(body),
      id: body.submissionID,
      ts: Date.now(),
    });
  },
};

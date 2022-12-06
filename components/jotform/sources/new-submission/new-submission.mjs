import jotform from "../../jotform.app.mjs";

export default {
  key: "jotform-new-submission",
  name: "New Submission (Instant)",
  description: "Emit new event when a form is submitted",
  version: "0.0.6",
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
    async deploy() {
      const { content: form } = await this.jotform.getForm(this.formId);
      const { content: submissions } = await this.jotform.getFormSubmissions({
        formId: this.formId,
        params: {
          limit: 25,
          orderby: "created_at",
        },
      });
      for (const submission of submissions.reverse()) {
        const body = {
          formID: form.id,
          formTitle: form.title,
          ip: submission.ip,
          submissionID: submission.id,
          username: form.username,
        };
        const meta = {
          id: submission.id,
          summary: form.title,
          ts: Date.now(),
        };
        this.$emit(body, meta);
      }
    },
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

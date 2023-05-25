import jotform from "../../jotform.app.mjs";

export default {
  key: "jotform-new-submission",
  name: "New Submission (Instant)",
  description: "Emit new event when a form is submitted",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    jotform,
    http: "$.interface.http",
    formId: {
      propDefinition: [
        jotform,
        "formId",
      ],
    },
    encrypted: {
      propDefinition: [
        jotform,
        "encrypted",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.encrypted) {
      props.privateKey = jotform.propDefinitions.privateKey;
    }
    return props;
  },
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
      for (let submission of submissions.reverse()) {
        if (this.encrypted) {
          submission = this.jotform.decryptSubmission(submission, this.privateKey);
        }
        const meta = {
          id: submission.id,
          summary: form.title,
          ts: Date.now(),
        };
        this.$emit(submission, meta);
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
    let { content: submission } = await this.jotform.getFormSubmission({
      submissionId: body.submissionID,
    });

    if (this.encrypted) {
      submission = this.jotform.decryptSubmission(submission, this.privateKey);
    }

    this.$emit(submission, {
      summary: body.formTitle || JSON.stringify(body),
      id: body.submissionID,
      ts: Date.now(),
    });
  },
};

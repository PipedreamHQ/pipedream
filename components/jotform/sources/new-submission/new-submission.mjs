import jotform from "../../jotform.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "jotform-new-submission",
  name: "New Submission (Instant)",
  description: "Emit new event when a form is submitted",
  version: "0.1.6",
  type: "source",
  dedupe: "unique",
  props: {
    jotform,
    http: "$.interface.http",
    teamId: {
      propDefinition: [
        jotform,
        "teamId",
      ],
    },
    formId: {
      propDefinition: [
        jotform,
        "formId",
        (c) => ({
          teamId: c.teamId,
          excludeDeleted: true,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      const { content: form } = await this.jotform.getForm(this.formId, this.teamId);
      const { content: submissions } = await this.jotform.getFormSubmissions({
        formId: this.formId,
        teamId: this.teamId,
        params: {
          limit: 25,
          orderby: "created_at",
        },
      });
      for (let submission of submissions.reverse()) {
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
        teamId: this.teamId,
      }));
    },
    async deactivate() {
      return (await this.jotform.deleteHook({
        endpoint: this.http.endpoint,
        formId: this.formId,
        teamId: this.teamId,
      }));
    },
  },
  async run(event) {
    const { body } = event;
    let { content: submission } = await this.jotform.getFormSubmission({
      submissionId: body.submissionID,
      teamId: this.teamId,
    });

    // insert answers from the webhook event
    const rawRequest = JSON.parse(body.rawRequest);
    for (const key of Object.keys(rawRequest)) {
      const regex = /^q(\d+)_/;
      const match = key.match(regex);
      if (match && match[1]) {
        submission.answers[match[1]].answer = rawRequest[key];
      }
    }

    this.$emit(submission, {
      summary: body.formTitle || JSON.stringify(body),
      id: body.submissionID,
      ts: Date.now(),
    });
  },
  sampleEmit,
};

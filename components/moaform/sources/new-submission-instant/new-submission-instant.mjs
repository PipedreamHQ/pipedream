import { axios } from "@pipedream/platform";
import moaform from "../../moaform.app.mjs";

export default {
  key: "moaform-new-submission-instant",
  name: "New Submission Instant",
  description: "Emit new event every time a new form submission is received. [See the documentation](https://help.moaform.com)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    moaform,
    db: "$.service.db",
    formId: {
      propDefinition: [
        moaform,
        "formId",
      ],
    },
    fields: {
      propDefinition: [
        moaform,
        "fields",
      ],
    },
    httpSource: {
      type: "$.interface.http",
      label: "HTTP Source",
      description: "HTTP source to set up webhooks",
    },
  },
  hooks: {
    async deploy() {
      const webhooks = await this.moaform.getWebhooks({
        formId: this.formId,
      });

      for (const webhook of webhooks) {
        this.$emit(webhook, {
          id: webhook.id,
          summary: `Existing webhook: ${webhook.id}`,
          ts: Date.now(),
        });
      }
    },
    async activate() {
      const {
        formId, fields,
      } = this;
      const url = this.httpSource.url;
      const webhook = await this.moaform.createWebhook({
        formId,
        url,
        fields,
      });

      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.moaform.deleteWebhook({
        formId: this.formId,
        webhookId,
      });
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const id = headers["x-moaform-submission-id"];
    const formId = body.formId;
    const submissionFields = this.fields.length ?
      this.fields.reduce((acc, field) => ({
        ...acc,
        [field]: body.fields[field],
      }), {})
      : body.fields;

    const eventToEmit = {
      formId,
      ...submissionFields,
    };

    this.$emit(eventToEmit, {
      id,
      summary: `New submission received for form ${formId}`,
      ts: Date.now(),
    });
  },
};

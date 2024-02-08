import axios from "@pipedream/platform";
import formpress from "../../formpress.app.mjs";

export default {
  key: "formpress-new-submission-instant",
  name: "New Submission Instant",
  description: "Emit new event when there is a new submission.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    formpress,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const tokenResponse = await this.formpress.createToken({
        apiKey: this.formpress.$auth.apiKey,
        expiryDate: this.formpress.$auth.expiryDate,
      });
      const userId = tokenResponse.data.user_id;
      const forms = await this.formpress.getForms({
        userId: userId,
        token: tokenResponse.data.token,
      });
      for (const form of forms.data) {
        await this.formpress.subscribeWebhook({
          formId: form.id,
          webhookUrl: this.http.endpoint,
          token: tokenResponse.data.token,
        });
      }
    },
    async deactivate() {
      const tokenResponse = await this.formpress.createToken({
        apiKey: this.formpress.$auth.apiKey,
        expiryDate: this.formpress.$auth.expiryDate,
      });
      const userId = tokenResponse.data.user_id;
      const forms = await this.formpress.getForms({
        userId: userId,
        token: tokenResponse.data.token,
      });
      for (const form of forms.data) {
        await this.formpress.unsubscribeWebhook({
          formId: form.id,
          webhookId: this.formpress.$auth.webhookId,
          token: tokenResponse.data.token,
        });
      }
    },
  },
  async run(event) {
    const body = event.body;
    this.$emit(body, {
      id: body.id,
      summary: `New submission: ${body.id}`,
      ts: Date.now(),
    });
  },
};

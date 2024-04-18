import videoask from "../../videoask.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "videoask-new-reply-from-a-respondent-instant",
  name: "New Reply from a Respondent (Instant)",
  description: "Emits an event when a respondent responds to a reply from a videoasker. [See the documentation](https://www.videoask.com/help)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    videoask,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        videoask,
        "formId",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhookId = await this.videoask.createWebhook({
        formId: this.formId,
        targetUrl: this.http.endpoint,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.videoask.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-videoask-signature"] !== this.videoask.$auth.oauth_access_token) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    this.$emit(body, {
      id: body.id,
      summary: `New reply from respondent: ${body.respondent_name}`,
      ts: Date.parse(body.created_at),
    });
  },
};

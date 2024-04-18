import videoask from "../../videoask.app.mjs";

export default {
  key: "videoask-new-response-from-a-respondent-instant",
  name: "New Response from a Respondent Instant",
  description: "Emits a new event when a transcription is ready after a respondent responds to a videoask. [See the documentation](https://www.videoask.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    videoask: {
      type: "app",
      app: "videoask",
    },
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
      const webhookId = await this.videoask.createWebhook(this.http.endpoint, this.formId);
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.videoask.deleteWebhook(webhookId, this.formId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate incoming event
    if (headers["Videoask-Signature"] !== this.videoask.$auth.oauth_access_token) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Assuming that VideoAsk sends the transcription in the body of the webhook payload
    // and that it includes a unique id and a timestamp
    if (body && body.transcription) {
      this.$emit(body, {
        id: body.id,
        summary: `New transcription for respondent: ${body.respondentId}`,
        ts: Date.parse(body.timestamp),
      });
    } else {
      console.log("No transcription data found in the event");
    }
  },
};

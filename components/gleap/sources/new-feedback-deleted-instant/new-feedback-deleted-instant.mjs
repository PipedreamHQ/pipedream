import gleap from "../../gleap.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "gleap-new-feedback-deleted-instant",
  name: "New Feedback Deleted (Instant)",
  description: "Emit new event when a feedback is deleted. [See the documentation](https://docs.gleap.io/server/rest-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    gleap,
    feedbackId: {
      propDefinition: [
        gleap,
        "feedbackId",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const feedbacks = await this.gleap.getFeedbacksOrderedByCreatedAt();
      feedbacks.slice(0, 50).forEach((feedback) => {
        this.$emit(feedback, {
          id: feedback.id,
          summary: `Feedback ID ${feedback.id} deleted`,
          ts: Date.parse(feedback.createdAt),
        });
      });
    },
    async activate() {
      // Activation logic, such as creating a webhook, would go here
    },
    async deactivate() {
      // Deactivation logic, such as removing a webhook, would go here
    },
  },
  async run(event) {
    const signature = event.headers["x-gleap-signature"];
    const secretToken = this.gleap.$auth.api_token;
    const computedSignature = crypto
      .createHmac("sha256", secretToken)
      .update(JSON.stringify(event.body))
      .digest("hex");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    if (event.body && event.body.feedbackId) {
      const feedbackId = event.body.feedbackId;

      this.$emit(event.body, {
        id: feedbackId,
        summary: `Feedback Deleted: ${feedbackId}`,
        ts: Date.parse(event.body.createdAt) || +new Date(),
      });
    } else {
      this.http.respond({
        status: 400,
        body: "Bad Request: Missing feedbackId",
      });
    }
  },
};

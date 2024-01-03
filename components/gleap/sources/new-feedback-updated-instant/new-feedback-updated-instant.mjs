import gleap from "../../gleap.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "gleap-new-feedback-updated-instant",
  name: "New Feedback Updated (Instant)",
  description: "Emit new event when an existing feedback is updated. [See the documentation](https://docs.gleap.io/server/rest-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    gleap,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent feedbacks ordered by updatedAt
      const feedbacks = await this.gleap.getFeedbacksOrderedByUpdatedAt();
      // Emit each feedback
      feedbacks.slice(0, 50).forEach((feedback) => {
        this.$emit(feedback, {
          id: feedback.id,
          summary: `Feedback updated: ${feedback.id}`,
          ts: Date.parse(feedback.updatedAt),
        });
      });
    },
    async activate() {
      // Typically, you would create a webhook subscription here.
      // However, since no props are required and the instructions do not
      // specify the creation of a webhook subscription, this is left empty.
    },
    async deactivate() {
      // Typically, you would delete a webhook subscription here.
      // However, since no props are required and the instructions do not
      // specify the creation of a webhook subscription, this is left empty.
    },
  },
  async run(event) {
    const signature = event.headers["x-gleap-signature"];
    const secret = this.gleap.$auth.api_token;
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(event.body))
      .digest("hex");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Parse the body in case it's a string and not an already-parsed object
    const feedback = typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body;
    this.$emit(feedback, {
      id: feedback.id,
      summary: `Updated feedback: ${feedback.id}`,
      ts: Date.parse(feedback.updatedAt),
    });
  },
};

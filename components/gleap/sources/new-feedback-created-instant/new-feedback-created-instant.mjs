import gleap from "../../gleap.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gleap-new-feedback-created-instant",
  name: "New Feedback Created Instant",
  description: "Emit new event when a feedback is created. [See the documentation](https://docs.gleap.io/server/rest-api)",
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
      const feedbacks = await this.gleap.getFeedbacksOrderedByCreatedAt();
      // Emit the 50 most recent feedbacks
      for (const feedback of feedbacks.slice(0, 50)) {
        this.$emit(feedback, {
          id: feedback.id,
          summary: `New feedback: ${feedback.message}`,
          ts: Date.parse(feedback.createdat),
        });
      }
    },
    async activate() {
      // Placeholder for webhook activation if needed
    },
    async deactivate() {
      // Placeholder for webhook deactivation if needed
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.id,
      summary: `New feedback: ${body.message}`,
      ts: Date.parse(body.createdat),
    });

    this.http.respond({
      status: 200,
      body: "",
    });
  },
};

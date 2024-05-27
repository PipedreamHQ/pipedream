import { axios } from "@pipedream/platform";
import ispringLearn from "../../ispring_learn.app.mjs";

export default {
  key: "ispring_learn-new-completion-instant",
  name: "New Course or Material Completion",
  description: "Emits an event when courses or materials in a course are completed successfully. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ispringLearn,
    db: "$.service.db",
    courseId: ispringLearn.propDefinitions.courseId,
    materialId: ispringLearn.propDefinitions.materialId,
  },
  hooks: {
    async deploy() {
      // Fetches the last event timestamp on deploy and stores it
      this.db.set("lastEventTimestamp", Date.now());
    },
    async activate() {
      const subscriptionData = {
        subscription: {
          subscriptionType: "COURSE_COMPLETED_SUCCESSFULLY",
          params: [
            {
              name: "courseIds",
              value: this.courseId
                ? `[\"${this.courseId}\"]`
                : "[]",
            },
            {
              name: "materialIds",
              value: this.materialId
                ? `[\"${this.materialId}\"]`
                : "[]",
            },
          ],
        },
      };
      // Assuming the existence of a method to subscribe to webhook notifications
      await this.ispringLearn.subscribeToWebhook(subscriptionData);
    },
    async deactivate() {
      // Assuming the existence of a method to unsubscribe to webhook notifications
      await this.ispringLearn.unsubscribeFromWebhook({
        courseId: this.courseId,
        materialId: this.materialId,
      });
    },
  },
  async run() {
    const lastEventTimestamp = this.db.get("lastEventTimestamp");
    const currentTimestamp = Date.now();

    // Example logic to fetch course or material completion events
    // This is a placeholder logic as fetching real completion events would depend on iSpring Learn's API capabilities
    const completions = [
      // Example completion event
      {
        id: "exampleId",
        timestamp: currentTimestamp,
        summary: "Course/Material completed",
      },
    ];

    completions.forEach((completion) => {
      if (completion.timestamp > lastEventTimestamp) {
        this.$emit(completion, {
          id: completion.id,
          summary: completion.summary,
          ts: completion.timestamp,
        });
      }
    });

    // Update the last event timestamp
    this.db.set("lastEventTimestamp", currentTimestamp);
  },
};

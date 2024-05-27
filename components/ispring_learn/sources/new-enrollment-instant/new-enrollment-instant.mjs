import ispringLearn from "../../ispring_learn.app.mjs";

export default {
  key: "ispring_learn-new-enrollment-instant",
  name: "New Enrollment Instant",
  description: "Emits an event when learners are enrolled in courses.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ispringLearn,
    db: "$.service.db",
    courseId: {
      propDefinition: [
        ispringLearn,
        "courseId",
      ],
    },
    userId: {
      propDefinition: [
        ispringLearn,
        "userId",
      ],
    },
    enrollmentDate: {
      propDefinition: [
        ispringLearn,
        "enrollmentDate",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // This hook could be used to perform one-time setup steps when the source is deployed
      // For this specific source, there's no initial setup required
    },
    async activate() {
      // This hook could subscribe to webhook events or similar when the source is activated
      // However, for the scope of this exercise, we'll assume it's not applicable
    },
    async deactivate() {
      // This hook could unsubscribe from webhook events or similar when the source is deactivated
      // However, for the scope of this exercise, we'll assume it's not applicable
    },
  },
  async run() {
    const userIds = [
      this.userId,
    ]; // Assuming single user enrollment for simplicity
    const courseIds = [
      this.courseId,
    ];
    const enrollmentDate = this.enrollmentDate
      ? this.enrollmentDate
      : new Date().toISOString();

    try {
      const response = await this.ispringLearn.enrollUser({
        userIds,
        courseIds,
        enrollmentDate,
      });

      if (response) {
        this.$emit(response, {
          id: `${response.data}${new Date().toISOString()}`,
          summary: `New Enrollment: User ${this.userId} in Course ${this.courseId}`,
          ts: Date.now(),
        });
      }
    } catch (error) {
      throw new Error(`Failed to enroll user: ${error.message}`);
    }
  },
};

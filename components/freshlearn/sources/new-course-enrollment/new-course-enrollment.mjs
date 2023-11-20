import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import freshlearn from "../../freshlearn.app.mjs";

export default {
  key: "freshlearn-new-course-enrollment",
  name: "New Course Enrollment",
  description: "Emit new event when there's a new course enrollment.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    freshlearn,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      // Emit all existing course enrollments on the first run
      const enrollments = await this.freshlearn.emitNewCourseEnrollmentEvent();
      for (const enrollment of enrollments) {
        this.$emit(enrollment, {
          id: enrollment.enrollmentId,
          summary: `New course enrollment: ${enrollment.courseId}`,
          ts: Date.now(),
        });
      }
    },
  },
  async run() {
    // Fetch new course enrollments
    const enrollments = await this.freshlearn.emitNewCourseEnrollmentEvent();
    for (const enrollment of enrollments) {
      this.$emit(enrollment, {
        id: enrollment.enrollmentId,
        summary: `New course enrollment: ${enrollment.courseId}`,
        ts: Date.now(),
      });
    }
  },
};

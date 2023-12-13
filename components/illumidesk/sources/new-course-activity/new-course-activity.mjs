import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-new-course-activity",
  name: "New Course Activity",
  description: "Emit new event when a new course activity is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    illumidesk: {
      type: "app",
      app: "illumidesk",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    courseId: {
      propDefinition: [
        illumidesk,
        "courseId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const activities = await this.illumidesk.createCourseActivity({
        courseId: this.courseId,
      });
      if (activities.length > 0) {
        const lastActivity = activities[0];
        this.db.set("lastActivityId", lastActivity.id);
        this.$emit(lastActivity, {
          id: lastActivity.id,
          summary: `New activity in course ${this.courseId}`,
          ts: Date.now(),
        });
      }
    },
  },
  async run() {
    const activities = await this.illumidesk.createCourseActivity({
      courseId: this.courseId,
    });
    const lastActivityId = this.db.get("lastActivityId");
    for (const activity of activities) {
      if (activity.id !== lastActivityId) {
        this.$emit(activity, {
          id: activity.id,
          summary: `New activity in course ${this.courseId}`,
          ts: Date.now(),
        });
      } else {
        break;
      }
    }
    if (activities.length > 0) {
      this.db.set("lastActivityId", activities[0].id);
    }
  },
};

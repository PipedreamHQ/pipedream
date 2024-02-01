import { axios } from "@pipedream/platform";
import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-new-course",
  name: "New Course Created",
  description: "Emits an event for each new course created in Edusign. [See the documentation](https://ext.edusign.fr/doc/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    edusign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    ...edusign.methods,
  },
  hooks: {
    async deploy() {
      // Fetch the most recent courses to backfill events
      let hasMore = true;
      let page = 0;
      const courses = [];

      while (hasMore) {
        const response = await this.edusign.getCourseDetails({
          page,
        });
        if (response.length > 0) {
          courses.unshift(...response.reverse());
          if (response.length < 50) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }

      courses.slice(0, 50).forEach((course) => {
        const ts = Date.parse(course.START) || Date.now();
        this.$emit(course, {
          id: course.ID,
          summary: `New Course: ${course.NAME}`,
          ts,
        });
      });

      this.db.set("lastProcessedId", courses[0]?.ID);
    },
  },
  async run() {
    // Retrieve the last course ID that was processed
    const lastProcessedId = this.db.get("lastProcessedId") || null;
    let hasMore = true;
    let page = 0;

    while (hasMore) {
      const response = await this.edusign.getCourseDetails({
        page,
      });

      if (response.length > 0) {
        const newCourses = response.filter((course) => !lastProcessedId || course.ID > lastProcessedId);

        // Emit events for new courses and update the last processed ID
        newCourses.forEach((course) => {
          const ts = Date.parse(course.START) || Date.now();
          this.$emit(course, {
            id: course.ID,
            summary: `New Course: ${course.NAME}`,
            ts,
          });
        });

        if (newCourses.length > 0) {
          this.db.set("lastProcessedId", newCourses[newCourses.length - 1].ID);
        }

        page++;
      } else {
        hasMore = false;
      }
    }
  },
};

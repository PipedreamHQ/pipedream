import { defineSource } from "@pipedream/types";
import xperiencify from "../../app/xperiencify.app";

export default defineSource({
  name: "Student Added to Course",
  description: "Emit new event when a student enrolls into a course.",
  key: "xperiencify-student-added-to-course",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    xperiencify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    courseId: {
      propDefinition: [
        xperiencify,
        "courseId",
      ],
    },
  },
  methods: {
    getMeta({
      email, firstName,
    }) {
      return {
        id: email,
        summary: `New student ${firstName}: ${email}`,
        ts: new Date().getTime(),
      };
    },
  },
  async run() {
    const all = await this.xperiencify.getStudentsForCourse({
      courseId: this.courseId,
    });

    for (const student of all) {
      this.$emit(student, this.getMeta(student));
    }
  },
});

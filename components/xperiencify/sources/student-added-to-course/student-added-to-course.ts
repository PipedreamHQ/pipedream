import { defineSource } from "@pipedream/types";
import xperiencify from "../../app/xperiencify.app";

export default defineSource({
  name: "Student Added to Course",
  description: "Emit new event when a student enrolls into a course.",
  key: "xperiencify-student-added-to-course",
  version: "0.0.1",
  type: "source",
  props: {
    xperiencify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
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
    setStudents(students = new Set()) {
      this.db.set("students", Array.from(students));
    },
    getStudents() {
      const students = this.db.get("students");
      return new Set(students);
    },
    getMeta(student) {
      return {
        id: student.email,
        summary: `New student ${student.firstName}: ${student.email}`,
        ts: new Date().getTime(),
      };
    },
  },
  async run() {
    const current = this.getStudents();
    const all = await this.xperiencify.getStudentsForCourse({
      courseId: this.courseId,
    });

    for (const student of all) {
      if (!current.has(student.email)) {
        current.add(student.email);
        this.$emit(student, this.getMeta(student));
      }
    }

    this.setStudents(current);
  },
});

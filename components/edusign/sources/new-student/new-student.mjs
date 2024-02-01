import { axios } from "@pipedream/platform";
import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-new-student",
  name: "New Student Registered",
  description: "Emits an event when a new student is registered in Edusign. [See the documentation](https://ext.edusign.fr/doc/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    edusign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // run every 60 seconds
      },
    },
  },
  hooks: {
    async deploy() {
      // Emit events for the last 50 registered students during the deploy
      let hasMore = true;
      let page = 1;
      while (hasMore) {
        const students = await this.edusign.registerStudent({
          page,
        });
        students.forEach((student, index) => {
          if (index < 50) {
            this.$emit(student, {
              id: student.studentId,
              summary: `${student.firstName} ${student.lastName} registered`,
              ts: Date.parse(student.dateOfBirth),
            });
          }
        });
        page++;
        hasMore = students.length === 50;
      }
    },
    async activate() {
      // Activation hook is not required for this scenario
    },
    async deactivate() {
      // Deactivation hook is not required for this scenario
    },
  },
  async run() {
    // Retrieve the last studentId emitted
    const lastStudentId = this.db.get("lastStudentId") || 0;

    // Fetch the latest students
    const students = await this.edusign.registerStudent({});

    // Filter out students that have already been emitted
    const newStudents = students.filter((student) => student.studentId > lastStudentId);

    // Emit an event for each new student
    newStudents.forEach((student) => {
      this.$emit(student, {
        id: student.studentId,
        summary: `${student.firstName} ${student.lastName} registered`,
        ts: Date.parse(student.dateOfBirth) || Date.now(),
      });
    });

    // Update the lastStudentId in the DB
    if (newStudents.length > 0) {
      const latestStudentId = Math.max(...newStudents.map((s) => s.studentId));
      this.db.set("lastStudentId", latestStudentId);
    }
  },
};

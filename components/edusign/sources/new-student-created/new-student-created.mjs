import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "edusign-new-student-created",
  name: "New Student Created",
  description: "Emit new event when a new student is created. [See the documentation](https://developers.edusign.com/reference/getv1student)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvents(max) {
      const lastCreated = this._getLastCreated();
      let maxCreated = lastCreated;

      const { result = [] } = await this.edusign.listStudents({
        params: {
          updatedAfter: lastCreated,
        },
      });

      const students = [];
      for (const student of result) {
        if (Date.parse(student.DATE_CREATED) > Date.parse(lastCreated)) {
          students.push(student);
          if (Date.parse(student.DATE_CREATED) > Date.parse(maxCreated)) {
            maxCreated = student.DATE_CREATED;
          }
        }
      }

      this._setLastCreated(maxCreated);

      if (!students.length) {
        return;
      }

      if (max && students.length > max) {
        students.length = max;
      }

      students.forEach((student) => {
        const meta = this.generateMeta(student);
        this.$emit(student, meta);
      });
    },
    generateMeta(student) {
      return {
        id: student.ID,
        summary: `New Student Created: ${student.FIRSTNAME} ${student.LASTNAME}`,
        ts: Date.parse(student.DATE_CREATED),
      };
    },
  },
  sampleEmit,
};

import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_classroom-new-due-date",
  name: "New Due Date",
  description: "Emit new event when an assignment's due date is created or updated'.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents({ pageSize }) {
      const { courseWork } = await this.googleClassroom.listCoursework({
        ...this.getParams(),
        pageSize,
      });
      return courseWork;
    },
    async getResults(after) {
      return this.paginate(this.googleClassroom.listCoursework, this.getParams(), "courseWork", after);
    },
    getParams() {
      return {
        courseId: this.course,
        courseWorkStates: this.courseStates,
      };
    },
    isRelevant(assignment, after = null) {
      return assignment.dueDate && this.isAfter(assignment.updateTime, after);
    },
    createDueDate(assignment) {
      const {
        dueDate, dueTime = {},
      } = assignment;
      if (!dueDate) {
        return;
      }
      const {
        year, month, day,
      } = dueDate;
      const {
        hours = 0, minutes = 0,
      } = dueTime;
      return new Date(year, month - 1, day - 1, hours, minutes, 0, 0);
    },
    generateMeta(assignment) {
      const dueDate = this.createDueDate(assignment);
      return {
        id: `${assignment.id}${Date.parse(dueDate)}`,
        summary: `New due date ${dueDate.toISOString()} for assignment ${assignment.title}`,
        ts: Date.parse(assignment.updateTime),
      };
    },
  },
};

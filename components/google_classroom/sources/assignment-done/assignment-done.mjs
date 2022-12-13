import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_classroom-assignment-done",
  name: "Assignment Done",
  description: "Emit new event when an assignment in a course is marked as done.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents({ pageSize }) {
      const submissions = await this.getResults();
      return submissions?.slice(0, pageSize);
    },
    async getResults(after = null) {
      const submissions = [];
      const courseWork = await this.paginate(this.googleClassroom.listCoursework, {
        courseId: this.course,
        courseWorkStates: this.courseStates,
      }, "courseWork");
      const params = this.getParams();
      for (const assignment of courseWork) {
        params.courseWorkId = assignment.id;
        const studentSubmissions = await this.paginate(this.googleClassroom.listSubmissions, params, "studentSubmissions", after);
        submissions.push(...studentSubmissions);
      }
      return submissions;
    },
    getParams() {
      return {
        courseId: this.course,
        states: [
          "TURNED_IN",
        ],
      };
    },
    isRelevant(submission, after = null) {
      if (after && Date.parse(submission.updateTime) <= after) {
        return false;
      }
      return true;
    },
    generateMeta(submission) {
      return {
        id: submission.id,
        summary: `New assignment submission with ID ${submission.id}`,
        ts: Date.parse(submission.updateTime),
      };
    },
  },
};

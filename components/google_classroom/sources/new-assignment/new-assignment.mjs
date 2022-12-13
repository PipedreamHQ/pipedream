import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_classroom-new-assignment",
  name: "New Assignment",
  description: "Emit new event when an assignment is added to a course.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Limit the results to assignments that contain keywords",
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.keywords?.length > 0) {
      return {
        searchDescription: {
          type: "boolean",
          label: "Search Title & Description?",
          description: "Set to `true` to search both title and description for keyword(s). If `false`, only assignment titles will be searched",
          optional: true,
          default: false,
        },
      };
    }
  },
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
      if (!this.isAfter(assignment.creationTime, after)) {
        return false;
      }
      if (this.keywords?.length > 0) {
        const titleMatch = this.keywordsMatch(assignment.title);
        if (this.searchDescription) {
          const descriptionMatch = this.keywordsMatch(assignment?.description);
          return titleMatch || descriptionMatch;
        } else {
          return titleMatch;
        }
      }
      return true;
    },
    keywordsMatch(text = "") {
      const matches = this.keywords?.filter((keyword) => text.includes(keyword));
      return matches.length > 0;
    },
    generateMeta(assignment) {
      return {
        id: assignment.id,
        summary: `New assignment ${assignment.title}`,
        ts: Date.parse(assignment.creationTime),
      };
    },
  },
};

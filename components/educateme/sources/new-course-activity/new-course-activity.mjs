import common from "../common/base.mjs";

export default {
  ...common,
  key: "educateme-new-course-activity",
  name: "New Course Activity",
  description: "Emit new event when a new activity is created in a course. [See the documentation](https://edme.notion.site/API-integration-v0-2-ef33641eb7f24fa9a6efb969c1f2928f)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    courseId: {
      propDefinition: [
        common.props.educateme,
        "courseId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResources() {
      const { result } = await this.educateme.listCourseActivities({
        courseId: this.courseId,
      });
      return result;
    },
    generateMeta(activity) {
      return {
        id: activity.id,
        summary: `New activity: ${activity.title}`,
        ts: Date.now(),
      };
    },
  },
};

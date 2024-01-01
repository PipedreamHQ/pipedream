import common from "../common/base.mjs";

export default {
  ...common,
  key: "illumidesk-new-course-activity",
  name: "New Course Activity",
  description: "Emit new event when a new course activity is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.illumidesk.listCourseActivities;
    },
    getArgs() {
      return {
        courseSlug: this.courseSlug,
      };
    },
    generateMeta(activity) {
      return {
        id: activity.uuid,
        summary: activity.title,
        ts: Date.parse(activity[this.getTsField()]),
      };
    },
  },
};

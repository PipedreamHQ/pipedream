import common from "../common/base.mjs";

export default {
  ...common,
  key: "illumidesk-new-course",
  name: "New Course",
  description: "Emit new event when a new course is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.illumidesk.listCoursesByCampus;
    },
    getArgs() {
      return {
        campusSlug: this.campusSlug,
      };
    },
    generateMeta(course) {
      return {
        id: course.uuid,
        summary: course.name,
        ts: Date.parse(course[this.getTsField()]),
      };
    },
  },
};

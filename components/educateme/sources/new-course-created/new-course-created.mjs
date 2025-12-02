import common from "../common/base.mjs";

export default {
  ...common,
  key: "educateme-new-course-created",
  name: "New Course Created",
  description: "Emit new event when a new course is created. [See the documentation]()https://edme.notion.site/API-integration-v0-2-ef33641eb7f24fa9a6efb969c1f2928f",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResources() {
      return this.educateme.listCourses();
    },
    generateMeta(course) {
      return {
        id: course.id,
        summary: `New course: ${course.title}`,
        ts: Date.now(),
      };
    },
  },
};

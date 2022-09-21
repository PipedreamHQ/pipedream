import common from "../common.mjs";

export default {
  ...common,
  key: "zenler-course-complete",
  name: "New Course Completed",
  description: "Emit new event when a course is completed. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#e0160d58-f0c5-8264-7ee2-fb991cd33e1b)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zenler.getCoursesBrief;
    },
    getResourceFnArgs() {
      return {};
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      console.log("resource", resource);
      return resource.completed
        && Date.parse(resource.created_at) > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `Course ID ${resource.id}`,
      };
    },
  },
};

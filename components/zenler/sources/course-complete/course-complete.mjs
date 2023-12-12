import common from "../common.mjs";

export default {
  ...common,
  key: "zenler-course-complete",
  name: "New Course Completed",
  description: "Emit new event when a course is completed. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#e0160d58-f0c5-8264-7ee2-fb991cd33e1b)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zenler.getCoursesBrief;
    },
    reverseResources(resources) {
      return resources;
    },
    resourceFilter(resource) {
      return resource.total_students === resource.completed;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.now(),
        summary: `Course ID ${resource.id}`,
      };
    },
  },
};

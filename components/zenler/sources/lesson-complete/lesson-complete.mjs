import common from "../common.mjs";

export default {
  ...common,
  key: "zenler-lesson-complete",
  name: "New Lesson Complete",
  description: "Emit new event when a lesson is completed. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#e0160d58-f0c5-8264-7ee2-fb991cd33e1b)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    courseId: {
      propDefinition: [
        common.props.zenler,
        "courseId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zenler.getCoursesDetailed;
    },
    getResourceFnArgs() {
      return {
        params: {
          "course_id": this.courseId,
        },
      };
    },
    resourceFilter(resource) {
      return resource.completion_percentage;
    },
    reverseResources(resources) {
      return resources;
    },
    generateMeta(resource) {
      return {
        id: `${resource.id}${resource.completion_percentage}`,
        ts: Date.parse(resource.last_attended),
        summary: `${resource.name} completed %${resource.completion_percentage}`,
      };
    },
  },
};

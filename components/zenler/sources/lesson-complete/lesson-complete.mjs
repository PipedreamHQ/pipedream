import common from "../common.mjs";

export default {
  ...common,
  key: "zenler-lesson-complete",
  name: "New Lesson Complete",
  description: "Emit new event when a lesson is completed. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#ad904518-bab0-5e8c-ed81-0f9efe508812)",
  type: "source",
  version: "0.0.1",
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
      return this.zenler.getCourse;
    },
    getResourceFnArgs() {
      return {
        courseId: this.courseId,
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return Date.parse(resource.created_at) > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `User ID ${resource.id}`,
      };
    },
  },
};

import common from "../common/base.mjs";

export default {
  ...common,
  key: "illumidesk-new-course-lesson",
  name: "New Course Lesson",
  description: "Emit new event when a new lesson for a specific course is created",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    courseSlug: {
      propDefinition: [
        common.props.illumidesk,
        "courseSlug",
        (c) => ({
          campusSlug: c.campusSlug,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.illumidesk.listCourseLessons;
    },
    getArgs() {
      return {
        courseSlug: this.courseSlug,
      };
    },
    generateMeta(lesson) {
      return {
        id: lesson.uuid,
        summary: lesson.title,
        ts: Date.parse(lesson[this.getTsField()]),
      };
    },
  },
};

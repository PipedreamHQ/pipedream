import common from "../common/base.mjs";

export default {
  ...common,
  key: "illumidesk-new-course-member",
  name: "New Course Member",
  description: "Emit new event when a new member is added to a course.",
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
      return this.illumidesk.listCourseParticipants;
    },
    getArgs() {
      return {
        courseSlug: this.courseSlug,
      };
    },
    generateMeta(member) {
      return {
        id: member.uuid,
        summary: member.email,
        ts: Date.parse(member[this.getTsField()]),
      };
    },
  },
};

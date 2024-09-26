import common from "../common/base.mjs";

export default {
  ...common,
  key: "meistertask-new-comment-created",
  name: "New Comment Created",
  description: "Emit new event when a new comment is created. [See the docs](https://developers.meistertask.com/reference/get-task-comments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.meistertask,
        "projectId",
      ],
      optional: true,
    },
    sectionId: {
      propDefinition: [
        common.props.meistertask,
        "sectionId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        common.props.meistertask,
        "taskId",
        (c) => ({
          projectId: c.projectId,
          sectionId: c.sectionId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.meistertask.listComments;
    },
    getArgs() {
      return {
        params: {
          sort: "-created_at",
        },
        taskId: this.taskId,
      };
    },
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: comment.text,
        ts: Date.parse(comment.created_at),
      };
    },
  },
};

import common from "../common/base.mjs";

export default {
  ...common,
  key: "meister-new-attachment-created",
  name: "New Attachment Created",
  description: "Emit new event when a new attachment is created. [See the docs](https://developers.meistertask.com/reference/get-task-attachments)",
  version: "0.0.1",
  type: "source",
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
      return this.meistertask.listAttachments;
    },
    getArgs() {
      return {
        params: {
          sort: "-created_at",
        },
        taskId: this.taskId,
      };
    },
    generateMeta(attachment) {
      return {
        id: attachment.id,
        summary: attachment.name,
        ts: Date.parse(attachment.created_at),
      };
    },
  },
};

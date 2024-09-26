import common from "../common/base.mjs";

export default {
  ...common,
  key: "meistertask-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created. [See the docs](https://developers.meistertask.com/reference/get-tasks)",
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
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      if (this.sectionId) {
        return this.meistertask.listSectionTasks;
      } else if (this.projectId) {
        return this.meistertask.listProjectTasks;
      } else {
        return this.meistertask.listTasks;
      }
    },
    getArgs() {
      const params = {
        sort: "-created_at",
      };
      if (this.sectionId) {
        return {
          sectionId: this.sectionId,
          params,
        };
      } else if (this.projectId) {
        return {
          projectId: this.projectId,
          params,
        };
      } else {
        return {
          params,
        };
      }
    },
    generateMeta(task) {
      return {
        id: task.id,
        summary: task.name,
        ts: Date.parse(task.created_at),
      };
    },
  },
};

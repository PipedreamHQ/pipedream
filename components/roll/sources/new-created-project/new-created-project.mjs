import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Created Project",
  key: "roll-new-created-project",
  description: "Emit new event when a project is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "ProjectId";
    },
    getFieldResponse() {
      return "project";
    },
    getQuery() {
      return "listProjects";
    },
    getOrderField() {
      return "{\"Created\": \"DESC\"}";
    },
    getDataToEmit({
      ProjectId,
      Created,
    }) {
      const dateTime = Created || new Date().getTime();
      return {
        id: ProjectId,
        summary: `New project with ProjectId ${ProjectId} was successfully created!`,
        ts: dateTime,
      };
    },
  },
};


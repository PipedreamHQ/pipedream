import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "zoho_projects-new-task",
  name: "New Task",
  description: "Emit new event when a new task is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/tasks-api.html#alink1)",
  type: "source",
  version: "0.0.1",
  props: {
    ...common.props,
    portalId: {
      propDefinition: [
        common.props.zohoProjects,
        "portalId",
      ],
    },
    projectId: {
      propDefinition: [
        common.props.zohoProjects,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return constants.MODULES.TASKS;
    },
    getResourceFn() {
      return this.zohoProjects.getTasks;
    },
    getResourceFnArgs() {
      return {
        portalId: this.portalId,
        projectId: this.projectId,
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return resource.created_time_long > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id_string,
        ts: resource.created_time_long,
        summary: `Task ID ${resource.id_string}`,
      };
    },
  },
};

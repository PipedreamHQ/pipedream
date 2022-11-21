import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "zoho_projects-new-task-list",
  name: "New Task List",
  description: "Emit new event when a task list is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/tasklists-api.html#alink1)",
  type: "source",
  version: "0.0.2",
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
    flag: {
      type: "string",
      label: "Flag",
      description: "Task lists of the flag must be `internal` or `external`.",
      options: [
        "internal",
        "external",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return constants.MODULES.TASKLISTS;
    },
    getResourceFn() {
      return this.zohoProjects.getTaskLists;
    },
    getResourceFnArgs() {
      const {
        portalId,
        projectId,
        flag,
      } = this;
      return {
        portalId,
        projectId,
        params: {
          flag,
          sort_column: "created_time", // created_time | last_modified_time
          sort_order: "descending", // ascending | descending
        },
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
        summary: `Tasklist ID ${resource.id_string}`,
      };
    },
  },
};

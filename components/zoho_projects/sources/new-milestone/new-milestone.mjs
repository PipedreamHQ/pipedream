import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "zoho_projects-new-milestone",
  name: "New Milestone",
  description: "Emit new event when a new milestone is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/milestones-api.html#alink1)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
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
      return constants.MODULES.MILESTONES;
    },
    getResourceFn() {
      return this.zohoProjects.getMilestones;
    },
    getResourceFnArgs() {
      return {
        portalId: this.portalId,
        projectId: this.projectId,
        params: {
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
        summary: `Milestone ID ${resource.id_string}`,
      };
    },
  },
};

import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "zoho_projects-new-project",
  name: "New Project",
  description: "Emit new event when a new project is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/projects-api.html#alink1)",
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
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return constants.MODULES.PROJECTS;
    },
    getResourceFn() {
      return this.zohoProjects.getProjects;
    },
    getResourceFnArgs() {
      return {
        portalId: this.portalId,
        params: {
          sort_column: "created_time", // created_time | last_modified_time
          sort_order: "descending", // ascending | descending
        },
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return resource.created_date_long > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id_string,
        ts: resource.created_date_long,
        summary: `Project ID ${resource.id_string}`,
      };
    },
  },
};

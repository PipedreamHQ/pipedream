import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-new-file",
  name: "New File",
  description: "Emit new event when a new file is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/documents-api.html#alink1)",
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
      return constants.MODULES.DOCUMENTS;
    },
    getResourceFn() {
      return this.zohoProjects.getDocuments;
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
        summary: `File ID ${resource.id_string}`,
      };
    },
  },
};

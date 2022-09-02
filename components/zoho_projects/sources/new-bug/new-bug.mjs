import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "zoho_projects-new-bug",
  name: "New Bug",
  description: "Emit new event when a new bug is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/bugs-api.html#alink1)",
  type: "source",
  version: "0.0.1",
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
      return constants.MODULES.BUGS;
    },
    getResourceFn() {
      return this.zohoProjects.getBugs;
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
        summary: `Bug ID ${resource.id_string}`,
      };
    },
  },
};

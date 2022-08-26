import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-update-project",
  name: "Update Project",
  description: "Updates a project. [See the docs here](https://www.zoho.com/projects/help/rest-api/projects-api.html#alink6)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

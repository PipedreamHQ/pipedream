import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-create-bug",
  name: "Create Bug",
  description: "Creates a bug. [See the docs here](https://www.zoho.com/projects/help/rest-api/bugs-api.html#alink3)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-new-project",
  name: "New Project",
  description: "Emit new event when a new project is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/projects-api.html#alink1)",
  type: "source",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

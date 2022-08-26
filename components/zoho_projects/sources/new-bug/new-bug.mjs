import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-new-bug",
  name: "New Bug",
  description: "Emit new event when a new bug is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/bugs-api.html#alink1)",
  type: "source",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

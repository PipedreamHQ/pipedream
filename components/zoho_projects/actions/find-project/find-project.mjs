import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-find-project",
  name: "Find Project",
  description: "Lists the modules across the portal based on the search term. The API returns both active and archived projects for the users having admin privileges. [See the docs here](https://www.zoho.com/projects/help/rest-api/search-api.html#alink1)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

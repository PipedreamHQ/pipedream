import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-new-file",
  name: "New File",
  description: "Emit new event when a new file is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/documents-api.html#alink1)",
  type: "source",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

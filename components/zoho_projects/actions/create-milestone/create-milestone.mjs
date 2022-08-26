import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-create-milestone",
  name: "Create Milestone",
  description: "Creates a milestone. [See the docs here](https://www.zoho.com/projects/help/rest-api/milestones-api.html#alink3)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

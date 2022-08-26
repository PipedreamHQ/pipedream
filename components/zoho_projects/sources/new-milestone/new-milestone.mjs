import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-new-milestone",
  name: "New Milestone",
  description: "Emit new event when a new milestone is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/milestones-api.html#alink1)",
  type: "source",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

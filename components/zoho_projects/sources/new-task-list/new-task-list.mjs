import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-new-task-list",
  name: "New Task List",
  description: "Emit new event when a task list is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/tasklists-api.html#alink1)",
  type: "source",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

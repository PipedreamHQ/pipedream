import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-new-task",
  name: "New Task",
  description: "Emit new event when a new task is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/tasks-api.html#alink1)",
  type: "source",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

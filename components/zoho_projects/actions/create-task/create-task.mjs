import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-create-task",
  name: "Create Task",
  description: "Creates a task. [See the docs here](https://www.zoho.com/projects/help/rest-api/tasks-api.html#alink4)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

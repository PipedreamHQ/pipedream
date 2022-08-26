import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-create-task-list",
  name: "Create Task List",
  description: "Creates a task list. [See the docs here](https://www.zoho.com/projects/help/rest-api/tasklists-api.html#alink2)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

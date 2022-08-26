import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-new-log-time",
  name: "New Log Time",
  description: "Emit new event when a log time is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/log-time.html#alink1)",
  type: "source",
  version: "0.0.1",
  props: {
    zohoProjects,
  },
  async run() {},
};

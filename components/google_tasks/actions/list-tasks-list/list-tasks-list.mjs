import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-list-tasks-list",
  name: "List Tasks List",
  description: "Lists the authenticated user's task lists. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasklists/list)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      maxResults: this.maxResults,
    };
    const res = await this.app.paginate(
      this.app.getTaskLists.bind(this),
      params,
    );
    $.export("$summary", "List(s) Task successfully retrieved");
    return res;
  },
};

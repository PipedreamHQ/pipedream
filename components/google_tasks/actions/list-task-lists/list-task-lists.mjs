import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-list-task-lists",
  name: "List Task Lists",
  description: "Lists the authenticated user's task lists. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasklists/list)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    $.export("$summary", "Task List(s) successfully retrieved");
    return res;
  },
};

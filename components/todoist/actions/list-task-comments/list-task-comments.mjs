import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-task-comments",
  name: "List Task Comments",
  description: "Returns a list of comments for a task [See the docs here](https://developer.todoist.com/rest/v1/#get-all-comments)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
      optional: false,
    },
    task: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const params = {
      task_id: this.task,
    };
    const resp = await this.todoist.getComments({
      $,
      params,
    });
    $.export("$summary", "Successfully retrieved comments");
    return resp;
  },
};

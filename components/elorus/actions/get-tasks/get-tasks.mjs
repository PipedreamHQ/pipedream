import app from "../../elorus.app.mjs";

export default {
  key: "elorus-get-tasks",
  name: "Get Tasks",
  description: "Get a list of tasks from Elorus. [See the documentation](https://developer.elorus.com/#operation/tasks_list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    search: {
      propDefinition: [
        app,
        "search",
      ],
    },
    project: {
      propDefinition: [
        app,
        "project",
      ],
    },
    active: {
      propDefinition: [
        app,
        "active",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTasks({
      $,
      params: {
        search: this.search,
        project: this.project,
        active: this.active
          ? 1
          : 0,
      },
    });
    $.export("$summary", "Successfully sent the request and retrieved " + response.results.length + " results");
    return response;
  },
};

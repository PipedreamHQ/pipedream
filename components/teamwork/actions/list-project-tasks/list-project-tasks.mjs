import app from "../../teamwork.app.mjs";

export default {
  type: "action",
  key: "teamwork-list-project-tasks",
  name: "List Project Tasks",
  description: "List tasks from a project. [See the docs here](https://apidocs.teamwork.com/docs/teamwork/6e3da2c04d779-get-all-tasks-on-a-given-project)",
  version: "0.0.2",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.listProjectTasks(
      this.projectId,
      {},
      $,
    );
    $.export("$summary", "Tasks successfully listed");
    return res;
  },
};

import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-project-comments",
  name: "List Project Comments",
  description: "Returns a list of comments for a project. [See the docs here](https://developer.todoist.com/rest/v2/#get-all-comments)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
  },
  async run ({ $ }) {
    const params = {
      project_id: this.project,
    };
    const resp = await this.todoist.getComments({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${resp.length} comment${resp.length === 1
      ? ""
      : "s"}`);
    return resp;
  },
};

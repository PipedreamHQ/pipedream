import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-sections",
  name: "List Sections",
  description: "Returns a list of all sections. [See the docs here](https://developer.todoist.com/rest/v2/#get-all-sections)",
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
    },
  },
  async run ({ $ }) {
    const params = {
      project_id: this.project,
    };
    const resp = await this.todoist.getSections({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${resp.length} section${resp.length === 1
      ? ""
      : "s"}`);
    return resp;
  },
};

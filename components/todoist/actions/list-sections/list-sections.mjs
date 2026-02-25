import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-sections",
  name: "List Sections",
  description: "Returns a list of all sections. [See the documentation](https://developer.todoist.com/api/v1#tag/Sections/operation/get_sections_api_v1_sections_get)",
  version: "0.0.6",
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
    $.export("$summary", `Successfully retrieved ${resp?.results?.length} section${resp?.results?.length === 1
      ? ""
      : "s"}`);
    return resp?.results;
  },
};

import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-section",
  name: "Get Section",
  description: "Returns info about a section. [See the docs here](https://developer.todoist.com/rest/v2/#get-a-single-section)",
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
    sectionId: {
      propDefinition: [
        todoist,
        "section",
        (c) => ({
          project: c.project,
        }),
      ],
      optional: false,
    },
  },
  async run ({ $ }) {
    const resp = await this.todoist.getSections({
      $,
      params: {
        section_id: this.sectionId,
      },
    });
    $.export("$summary", "Successfully retrieved section");
    return resp;
  },
};

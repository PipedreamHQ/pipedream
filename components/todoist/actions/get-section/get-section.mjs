import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-section",
  name: "Get Section",
  description: "Returns info about a section. [See the documentation](https://developer.todoist.com/api/v1#tag/Sections/operation/get_section_api_v1_sections__section_id__get)",
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

import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-section",
  name: "Get Section",
  description: "Returns info about a section [See the docs here](https://developer.todoist.com/rest/v1/#get-a-single-section)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    sectionId: {
      propDefinition: [
        todoist,
        "sectionId",
      ],
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

import plainly from "../../plainly.app.mjs";

export default {
  key: "plainly-list-templates",
  name: "List Templates",
  description: "Fetches a list of available video templates in a project in the user's Plainly account. [See the documentation](https://www.plainlyvideos.com/documentation/api-reference)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    plainly,
    projectId: {
      propDefinition: [
        plainly,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const { templates } = await this.plainly.getProject({
      $,
      projectId: this.projectId,
    });

    if (templates?.length) {
      $.export("$summary", `Fetched ${templates.length} template${templates.length === 1
        ? ""
        : "s"}`);
    }
    return templates;
  },
};

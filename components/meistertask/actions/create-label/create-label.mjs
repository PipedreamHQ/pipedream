import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-create-label",
  name: "Create Label",
  description: "Create a new label in a project. [See the docs](https://developers.meistertask.com/reference/post-label)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    meistertask,
    projectId: {
      propDefinition: [
        meistertask,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the label. Must be unique (case-insensitive) for the project.",
    },
    labelColor: {
      propDefinition: [
        meistertask,
        "labelColor",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      color: this.labelColor,
    };
    const response = await this.meistertask.createLabel({
      $,
      data,
      projectId: this.projectId,
    });
    if (response) {
      $.export("$summary", `Successfully created label with ID ${response.id}`);
    }
    return response;
  },
};

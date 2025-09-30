import app from "../../northflank.app.mjs";

export default {
  key: "northflank-create-project",
  name: "Create Project",
  description: "Creates a new project on Northflank. [See the documentation](https://northflank.com/docs/v1/api/projects/create-project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    color: {
      propDefinition: [
        app,
        "color",
      ],
    },
    region: {
      propDefinition: [
        app,
        "region",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createProject({
      $,
      data: {
        name: this.name,
        description: this.description,
        color: this.color,
        region: this.region,
      },
    });

    $.export("$summary", `Successfully created project ${this.name}`);
    return response;
  },
};

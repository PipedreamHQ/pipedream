import codescene from "../../codescene.app.mjs";

export default {
  key: "codescene-create-project",
  name: "Create a New Project",
  description: "Creates a new project in CodeScene. [See the documentation](https://codescene.io/docs/integrations/public-api.html?highlight=api#new-project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    codescene,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project",
      optional: true,
    },
    repoPaths: {
      type: "string[]",
      label: "Repo Paths",
      description: "The repositories paths of the project",
    },
    developerConfiguration: {
      propDefinition: [
        codescene,
        "developerConfiguration",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const repoPaths = typeof this.repoPaths === "string"
      ? JSON.parse(this.repoPaths)
      : this.repoPaths;

    const response = await this.codescene.createNewProject({
      $,
      data: {
        config: {
          "name": this.name,
          "repo-paths": repoPaths,
          "developer-configuration": this.developerConfiguration,
        },
      },
    });

    $.export("$summary", `Successfully created a new project with Developer Configuration ID ${this.developerConfiguration}`);

    return response;
  },
};

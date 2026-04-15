import asana from "../../asana.app.mjs";

export default {
  type: "action",
  key: "asana-search-projects",
  version: "0.2.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Search Projects",
  description: "Finds an existing project. [See the documentation](https://developers.asana.com/docs/get-multiple-projects)",
  props: {
    asana,
    name: {
      label: "Name",
      description: "The name to filter projects on.",
      type: "string",
      optional: true,
    },
    workspace: {
      label: "Workspace",
      description: "The workspace or organization to filter projects on.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    archived: {
      label: "Archived",
      description: "Only return projects whose `archived` field takes on the value of this parameter.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      workspace,
      archived,
    } = this;

    const { data: projects } = await this.asana.getProjects({
      params: {
        workspace,
        archived,
      },
      $,
    });

    $.export("$summary", "Successfully retrieved projects");

    if (this.name) return projects.filter((project) => project.name.includes(name));
    else return projects;
  },
};

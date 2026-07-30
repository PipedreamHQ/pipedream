import postcards from "../../postcards.app.mjs";

export default {
  key: "postcards-list-projects",
  name: "List Projects",
  description: "List projects in the authenticated team, ordered by most-recently edited. [See the documentation](https://help.designmodo.com/article/537-api-getting-started).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postcards,
    folderId: {
      propDefinition: [
        postcards,
        "folderId",
      ],
    },
    maxResults: {
      propDefinition: [
        postcards,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const projects = await this.postcards.getProjects({
      $,
      params: {
        folder_id: this.folderId,
      },
      max: this.maxResults,
    });
    $.export("$summary", `Listed ${projects.length} project(s)`);
    return projects;
  },
};

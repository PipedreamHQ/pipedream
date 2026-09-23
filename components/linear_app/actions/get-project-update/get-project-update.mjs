import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-get-project-update",
  name: "Get Project Update",
  description: "Retrieve a single project update by its ID in Linear. Use **List Project Updates** first to obtain a valid update ID. Returns the full update including `id`, `body`, `health`, `createdAt`, and author. Example: `projectUpdateId: \"pu_01xyz\"` → returns `{id: \"pu_01xyz\", body: \"Q3 milestone complete.\", health: \"onTrack\", createdAt: \"2024-01-15T10:00:00Z\"}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectUpdate?query=projectUpdate).",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    projectUpdateId: {
      type: "string",
      label: "Project Update ID",
      description: "The ID of the project update to retrieve (a UUID). Run **List Project Updates** first to obtain a valid ID.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in the returned project update object. When omitted, the full payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"body\", \"health\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const projectUpdate = await this.linearApp.getProjectUpdateGraphQL(this.projectUpdateId);

    $.export("$summary", `Successfully retrieved project update ${projectUpdate.id}`);

    if (this.fields?.length) {
      const shaped = {};
      for (const field of this.fields) {
        shaped[field] = projectUpdate[field];
      }
      return shaped;
    }

    return projectUpdate;
  },
};

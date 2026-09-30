import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-get-project-update",
  name: "Get Project Update",
  description: "Retrieve a single project update by its ID in Linear. Use **List Project Updates** first to obtain a valid update ID. Returns the full update including `id`, `body`, `health`, `createdAt`, and author. Example: `projectUpdateId: \"7df5e7f9-a357-4539-ae94-4a004fec635f\"` → returns `{id: \"7df5e7f9-a357-4539-ae94-4a004fec635f\", body: \"Q3 milestone complete.\", health: \"onTrack\", createdAt: \"2024-01-15T10:00:00Z\"}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectUpdate?query=projectUpdate).",
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
      description: "The ID of the project update to retrieve (a UUID, e.g. `7df5e7f9-a357-4539-ae94-4a004fec635f`). Run **List Project Updates** first to obtain a valid ID.",
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

    return utils.pickFields(projectUpdate, this.fields);
  },
};

import linearApp from "../../linear_app.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "linear_app-create-project-update",
  name: "Create Project Update",
  description: "Post a status update on a Linear project. Use **List Projects** first to obtain the project ID. Updates appear in the project's activity feed. Example: `projectId: \"a1b2c3d4-0000-0000-0000-000000000001\"`, `body: \"Q3 milestone complete; all P0 issues resolved.\"`, `health: \"onTrack\"` → returns `{success: true, projectUpdate: {id: \"pu_01xyz\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=projectUpdateCreate).",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
      description: "The ID of the project to create the update for (a UUID, e.g. `a1b2c3d4-0000-0000-0000-000000000001`). Run **List Projects** first to obtain a valid project ID.",
      optional: false,
    },
    body: {
      propDefinition: [
        linearApp,
        "updateBody",
      ],
      description: "The content of the project update in markdown format. Example: `Q3 milestone is on track; all P0 issues resolved.`",
    },
    health: {
      propDefinition: [
        linearApp,
        "health",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.createProjectUpdate({
      projectId: this.projectId,
      body: this.body,
      health: this.health,
    });

    if (!response.success) {
      throw new ConfigurationError("Failed to create project update");
    }

    const summary = response?._projectUpdate?.id
      ? `Successfully created project update with ID ${response._projectUpdate.id}`
      : "Successfully created project update";
    $.export("$summary", summary);

    return response;
  },
};

import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-initiative-update",
  name: "Create Initiative Update",
  description: "Post a status update on a Linear initiative. Use **List Initiatives** first to obtain the initiative ID. Updates appear in the initiative's activity feed and can include a health status. Example: `initiativeId: \"b2c3d4e5-0000-0000-0000-000000000002\"`, `body: \"Two projects completed; on track for Q4.\"`, `health: \"onTrack\"` → returns `{success: true, initiativeUpdate: {id: \"iu_01xyz\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=initiativeUpdateCreate).",
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
    initiativeId: {
      type: "string",
      label: "Initiative ID",
      description: "The ID of the initiative to create the update for (a UUID, e.g. `b2c3d4e5-0000-0000-0000-000000000002`). Run **List Initiatives** first to obtain a valid initiative ID.",
    },
    body: {
      propDefinition: [
        linearApp,
        "updateBody",
      ],
      description: "The content of the initiative update in markdown format. Example: `Initiative is progressing; two projects completed.`",
    },
    health: {
      propDefinition: [
        linearApp,
        "health",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.createInitiativeUpdate({
      initiativeId: this.initiativeId,
      body: this.body,
      health: this.health,
    });

    if (response?._initiativeUpdate) {
      $.export("$summary", `Successfully created initiative update with ID ${response._initiativeUpdate.id}`);
    }

    return response;
  },
};

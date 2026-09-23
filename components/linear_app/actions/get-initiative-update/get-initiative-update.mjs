import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-get-initiative-update",
  name: "Get Initiative Update",
  description: "Retrieve a single initiative update by its ID in Linear. Use **List Initiative Updates** first to obtain a valid update ID. Returns the full update including `id`, `body`, `health`, `createdAt`, and author. Example: `initiativeUpdateId: \"530f4366-88ab-4866-a44b-c2326728c32d\"` → returns `{id: \"530f4366-88ab-4866-a44b-c2326728c32d\", body: \"Two projects completed.\", health: \"onTrack\", createdAt: \"2024-01-15T10:00:00Z\"}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/InitiativeUpdate?query=initiativeUpdate).",
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
    initiativeUpdateId: {
      type: "string",
      label: "Initiative Update ID",
      description: "The ID of the initiative update to retrieve (a UUID, e.g. `530f4366-88ab-4866-a44b-c2326728c32d`). Run **List Initiative Updates** first to obtain a valid ID.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in the returned initiative update object. When omitted, the full payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"body\", \"health\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const initiativeUpdate =
      await this.linearApp.getInitiativeUpdateGraphQL(this.initiativeUpdateId);

    $.export("$summary", `Successfully retrieved initiative update ${initiativeUpdate.id}`);

    return utils.pickFields(initiativeUpdate, this.fields);
  },
};

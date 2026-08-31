// x-pd-ai: optimized
import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-create-location",
  name: "Create Location",
  description: "Create a new Ramp location (e.g. `New York HQ`). Use this to add a site before assigning users to it; the returned `id` can be passed to **Update User** or used to filter **List Transactions** / **List Users**. Associating an entity is optional — set the Entity ID only for multi-entity businesses that scope locations to a specific legal entity. [See the documentation](https://docs.ramp.com/developer-api/v1/api/locations#post-developer-v1-locations)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ramp,
    name: {
      propDefinition: [
        ramp,
        "name",
      ],
      description: "The name of the new location (e.g. `New York HQ`).",
    },
    entityId: {
      type: "string",
      label: "Entity ID",
      description: "Optional entity ID (a UUID, e.g. `dff9389a-2819-468e-a220-28e059b23f8e`) to associate with the location. Obtain it from the `entity_id` field returned by **List Locations**, or from your Ramp entities in the API. Only needed for multi-entity businesses.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ramp.createLocation({
      $,
      data: {
        name: this.name,
        entity_id: this.entityId,
      },
    });
    $.export("$summary", `Successfully created location "${this.name}" with ID ${response.id}`);
    return response;
  },
};

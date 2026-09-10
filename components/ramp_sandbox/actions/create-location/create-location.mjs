import ramp from "../../ramp_sandbox.app.mjs";
import createLocation from "@pipedream/ramp/actions/create-location/create-location.mjs";

export default {
  ...createLocation,
  key: "ramp_sandbox-create-location",
  name: "Create Location",
  description: "Create a new Ramp Sandbox location (e.g. `New York HQ`). Use this to add a site before assigning users to it; the returned `id` can be passed to **Update User** or used to filter **List Transactions** / **List Users**. Associating an entity is optional — set the Entity ID only for multi-entity businesses that scope locations to a specific legal entity. [See the documentation](https://docs.ramp.com/developer-api/v1/api/locations#post-developer-v1-locations)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
};

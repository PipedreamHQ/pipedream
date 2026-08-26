// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import createLocation from "@pipedream/ramp/actions/create-location/create-location.mjs";

export default {
  ...createLocation,
  key: "ramp_sandbox-create-location",
  name: "Create Location",
  description: "Create a new Ramp Sandbox location. [See the documentation](https://docs.ramp.com/developer-api/v1/api/locations#post-developer-v1-locations).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
      description: "Optional entity ID to associate with the location.",
      optional: true,
    },
  },
};

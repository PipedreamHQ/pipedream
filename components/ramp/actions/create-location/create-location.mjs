import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-create-location",
  name: "Create Location",
  description: "Create a new Ramp location. [See the documentation](https://docs.ramp.com/developer-api/v1/api/locations#post-developer-v1-locations).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ramp,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new location (e.g. `New York HQ`).",
    },
    entityId: {
      type: "string",
      label: "Entity ID",
      description: "Optional entity ID to associate with the location.",
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

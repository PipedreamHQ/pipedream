import smartthings from "../../smartthings.app.mjs";

export default {
  key: "smartthings-execute-scene",
  name: "Execute Scene",
  description: "Executes a SmartThings scene. [See the documentation](https://developer.smartthings.com/docs/api/public#tag/Scenes/operation/executeScene)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartthings,
    locationId: {
      propDefinition: [
        smartthings,
        "locationId",
      ],
      description: "Only list scenes in this location, e.g. `a1b2c3d4-0000-1111-2222-333344445555`. Use **List Locations** to find the ID (the `locationId` field).",
      optional: true,
    },
    sceneId: {
      propDefinition: [
        smartthings,
        "sceneId",
        (c) => ({
          locationId: c.locationId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smartthings.executeScene({
      $,
      sceneId: this.sceneId,
    });
    $.export("$summary", `Successfully executed scene ${this.sceneId}`);
    return response;
  },
};

import smartthings from "../../smartthings.app.mjs";

export default {
  key: "smartthings-list-scenes",
  name: "List Scenes",
  description: "Lists the scenes available to the connected SmartThings account, optionally filtered by location. [See the documentation](https://developer.smartthings.com/docs/api/public#tag/Scenes/operation/listScenes)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartthings,
    locationId: {
      propDefinition: [
        smartthings,
        "locationId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const scenes = [];
    const items = this.smartthings.paginate({
      $,
      resourceFn: (opts) => this.smartthings.listScenes({
        $,
        ...opts,
      }),
      params: {
        locationId: this.locationId,
      },
    });
    for await (const item of items) {
      scenes.push(item);
    }
    $.export("$summary", `Successfully retrieved ${scenes.length} scene${scenes.length === 1
      ? ""
      : "s"}`);
    return scenes;
  },
};

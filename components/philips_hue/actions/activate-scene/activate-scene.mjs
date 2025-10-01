import philipsHue from "../../philips_hue.app.mjs";

export default {
  key: "philips_hue-activate-scene",
  name: "Activate Scene",
  description: "Activates a Philips Hue light scene. [See the documentation](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    philipsHue,
    username: {
      propDefinition: [
        philipsHue,
        "username",
      ],
    },
    sceneId: {
      propDefinition: [
        philipsHue,
        "sceneId",
        (c) => ({
          username: c.username,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.philipsHue.updateScene({
      $,
      username: this.username,
      sceneId: this.sceneId,
      data: {
        recall: {
          action: "active",
        },
      },
    });
    $.export("$summary", `Successfully activated scene with ID: ${this.sceneId}`);
    return response;
  },
};

import philipsHue from "../../philips_hue.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "philips_hue-turn-light-on",
  name: "Turn Light On",
  description: "Turns on or off a Philips Hue light or group of lights. [See the documentation](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    lightId: {
      propDefinition: [
        philipsHue,
        "lightId",
        (c) => ({
          username: c.username,
        }),
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        philipsHue,
        "groupId",
        (c) => ({
          username: c.username,
        }),
      ],
      optional: true,
    },
    turnLightOff: {
      type: "boolean",
      label: "Turn Light(s) Off",
      description: "Set to `true` to turn the light(s) off instead of on",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.lightId && !this.groupId) || (this.lightId && this.groupId)) {
      throw new ConfigurationError("Must specify exactly one of Light ID or GroupID");
    }

    const opts = {
      $,
      username: this.username,
      data: {
        on: {
          on: !this.turnLightOff,
        },
      },
    };

    const response = this.lightId
      ? await this.philipsHue.updateLight({
        lightId: this.lightId,
        ...opts,
      })
      : await this.philipsHue.updateGroup({
        groupId: this.groupId,
        ...opts,
      });

    $.export("$summary", `Successfully turned ${this.turnLightOff
      ? "off"
      : "on"} light(s)`);
    return response;
  },
};

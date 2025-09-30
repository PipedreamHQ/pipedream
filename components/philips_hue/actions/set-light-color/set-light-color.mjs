import philipsHue from "../../philips_hue.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import convert from "color-convert";

export default {
  key: "philips_hue-set-light-color",
  name: "Set Light Color",
  description: "Sets the light color of a Philips Hue light. [See the documentation](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put)",
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
    color: {
      type: "string",
      label: "Color",
      description: "A hexidecimal color value to set the light(s) to. E.g. `#800080`",
    },
  },
  methods: {
    hexToCIE(hex) {
      const rgb = convert.hex.rgb(hex);
      const xyz = convert.rgb.xyz(rgb);
      const x = xyz[0] / (xyz[0] + xyz[1] + xyz[2]);
      const y = xyz[1] / (xyz[0] + xyz[1] + xyz[2]);
      return {
        x,
        y,
      };
    },
  },
  async run({ $ }) {
    if ((!this.lightId && !this.groupId) || (this.lightId && this.groupId)) {
      throw new ConfigurationError("Must specify exactly one of Light ID or GroupID");
    }

    const {
      x, y,
    } = this.hexToCIE(this.color);

    const opts = {
      $,
      username: this.username,
      data: {
        color: {
          xy: {
            x,
            y,
          },
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

    $.export("$summary", `Successfully set light color to ${this.color}`);
    return response;
  },
};

import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../constants.mjs";

const {
  ON: DEVELOPMENT_MODE_ON,
  OFF: DEVELOPMENT_MODE_OFF,
} = constants.DEVELOPMENT_MODES;

export default {
  key: "cloudflare_api_key-change-development-mode",
  name: "Change Development Mode",
  description: "Development Mode temporarily allows you to enter development mode for your websites if you need to make changes to your site. This will bypass Cloudflare's accelerated cache and slow down your site. [See the docs here](https://api.cloudflare.com/#zone-settings-change-development-mode-setting)",
  version: "0.0.1",
  type: "action",
  props: {
    cloudflare,
    zoneIdentifier: {
      propDefinition: [
        cloudflare,
        "zoneIdentifier",
      ],
    },
    developmentMode: {
      type: "string",
      label: "Development Mode",
      description: "Development mode value",
      options() {
        return [
          {
            label: "On",
            value: DEVELOPMENT_MODE_ON,
          },
          {
            label: "Off",
            value: DEVELOPMENT_MODE_OFF,
          },
        ];
      },
    },
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;
    const developmentMode = this.developmentMode;

    const response = await this.cloudflare.changeDevelopmentMode(zoneId, developmentMode);
    $.export("$summary", `Successfully updated zone #${zoneId} development mode to '${developmentMode}'`);

    return response;
  },
};

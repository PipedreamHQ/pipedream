import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloudflare_api_key-change-zone-development-mode",
  name: "Change Development Mode",
  description: "Development Mode temporarily allows you to enter development mode for your websites if you need to make changes to your site. This will bypass Cloudflare's accelerated cache and slow down your site. [See the docs here](https://api.cloudflare.com/#zone-settings-change-development-mode-setting)",
  version: "0.0.2",
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
      options: constants.DEVELOPMENT_MODE_OPTIONS,
    },
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;
    const developmentMode = this.developmentMode;

    const response = await this.cloudflare.changeDevelopmentMode(zoneId, developmentMode);
    $.export("$summary", `Turned ${developmentMode} development mode for #${zoneId}`);

    return response;
  },
};

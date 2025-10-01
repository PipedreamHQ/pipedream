import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-change-zone-development-mode",
  name: "Change Development Mode",
  description: "Development Mode temporarily allows you to enter development mode for your websites if you need to make changes to your site. This will bypass Cloudflare's accelerated cache and slow down your site. [See the documentation](https://developers.cloudflare.com/api/node/resources/zones/subresources/settings/methods/edit/)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudflare,
    zoneId: {
      propDefinition: [
        cloudflare,
        "zoneIdentifier",
      ],
    },
    value: {
      type: "string",
      label: "Development Mode",
      description: "Turn development mode on or off for the zone",
      options: [
        {
          label: "On",
          value: "on",
        },
        {
          label: "Off",
          value: "off",
        },
      ],
      default: "off",
    },
  },
  async run({ $ }) {
    const {
      zoneId,
      value,
    } = this;

    const response = await this.cloudflare.editZoneSetting({
      settingId: "development_mode",
      zone_id: zoneId,
      value,
    });
    $.export("$summary", "Successfully changed zone to development mode");

    return response;
  },
};

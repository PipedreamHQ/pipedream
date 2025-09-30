import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-change-ssl-setting",
  name: "Change Zone's SSL Setting",
  description: "Choose the appropriate SSL setting for your zone. [See the docs here](https://api.cloudflare.com/#zone-settings-change-ssl-setting)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudflare,
    zoneIdentifier: {
      propDefinition: [
        cloudflare,
        "zoneIdentifier",
      ],
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Whether to enable or disable Universal SSL",
    },
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;
    const enabled = this.enabled;

    const response = await this.cloudflare.changeZoneSslSetting({
      zone_id: zoneId,
      enabled,
    });
    $.export("$summary", `Successfully updated zone #${zoneId} SSL setting to '${enabled}'`);

    return response;
  },
};

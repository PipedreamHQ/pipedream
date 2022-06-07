import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-change-ssl-setting",
  name: "Change Zone's SSL Setting",
  description: "Choose the appropriate SSL setting for your zone. [See the docs here](https://api.cloudflare.com/#zone-settings-change-ssl-setting)",
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
    sslSetting: {
      type: "string",
      label: "SSL Setting",
      description: "Value of the zone SSL setting",
      options: [
        "off",
        "flexible",
        "full",
        "strict",
      ],
    },
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;
    const sslSetting = this.sslSetting;

    const response = await this.cloudflare.changeZoneSslSetting(zoneId, sslSetting);
    $.export("$summary", `Successfully updated zone #${zoneId} SSL setting to '${sslSetting}'`);

    return response;
  },
};

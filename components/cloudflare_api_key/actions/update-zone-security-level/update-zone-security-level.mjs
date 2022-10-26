import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloudflare_api_key-update-zone-security-level",
  name: "Update Zone Security Level",
  description: "Choose the appropriate security profile for your website, which will automatically adjust each of the security settings. [See the docs here](https://api.cloudflare.com/#zone-settings-change-security-level-setting)",
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
    securityLevel: {
      type: "string",
      label: "Security Level",
      description: "Security level value",
      options: constants.ZONE_SECURITY_LEVEL_OPTIONS,
    },
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;
    const securityLevel = this.securityLevel;

    const response = await this.cloudflare.updateZoneSecurityLevel(zoneId, securityLevel);
    $.export("$summary", `Successfully updated zone #${zoneId} security level to '${securityLevel}'`);

    return response;
  },
};

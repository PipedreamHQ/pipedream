import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../constants.mjs";

const {
  OFF: SECURITY_LEVEL_OFF,
  ESSENTIALLY_OFF: SECURITY_LEVEL_ESSENTIALLY_OFF,
  LOW: SECURITY_LEVEL_LOW,
  MEDIUM: SECURITY_LEVEL_MEDIUM,
  HIGH: SECURITY_LEVEL_HIGH,
  UNDER_ATTACK: SECURITY_LEVEL_UNDER_ATTACK,
} = constants.SECURITY_LEVELS;

export default {
  key: "cloudflare-update-zone-security-level",
  name: "Update Zone Security Level",
  description: "Choose the appropriate security profile for your website, which will automatically adjust each of the security settings. [See the docs here](https://api.cloudflare.com/#zone-settings-change-security-level-setting)",
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
    securityLevel: {
      type: "string",
      label: "Security Level",
      description: "Security level value",
      options() {
        return [
          {
            label: "Off",
            value: SECURITY_LEVEL_OFF,
          },
          {
            label: "Essentially Off",
            value: SECURITY_LEVEL_ESSENTIALLY_OFF,
          },
          {
            label: "Low",
            value: SECURITY_LEVEL_LOW,
          },
          {
            label: "Medium",
            value: SECURITY_LEVEL_MEDIUM,
          },
          {
            label: "High",
            value: SECURITY_LEVEL_HIGH,
          },
          {
            label: "Under Attack",
            value: SECURITY_LEVEL_UNDER_ATTACK,
          },
        ];
      },
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

import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-update-zone-security-level",
  name: "Update Zone Security Level",
  description: "Choose the appropriate security profile for your website, which will automatically adjust each of the security settings. [See the documentation](https://developers.cloudflare.com/api/node/resources/zones/subresources/settings/methods/edit/)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
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
      label: "Security Level",
      description: "Choose the appropriate security profile for your website",
      options: [
        {
          label: "Off",
          value: "off",
        },
        {
          label: "Essentially Off",
          value: "essentially_off",
        },
        {
          label: "Low",
          value: "low",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "High",
          value: "high",
        },
        {
          label: "Under Attack",
          value: "under_attack",
        },
      ],
      default: "medium",
    },
  },
  async run({ $ }) {
    const {
      zoneId,
      value,
    } = this;

    const response = await this.cloudflare.editZoneSetting({
      settingId: "security_level",
      zone_id: zoneId,
      value,
    });
    $.export("$summary", "Successfully updated zone with security level");

    return response;
  },
};

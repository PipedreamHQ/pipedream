import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-revoke-certificate",
  name: "Revoke Certificate",
  description: "Revoke an existing Origin CA certificate by its serial number. [See the docs here](https://api.cloudflare.com/#origin-ca-revoke-certificate)",
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
    certificateIdentifier: {
      propDefinition: [
        cloudflare,
        "certificateIdentifier",
        (c) => ({
          zoneIdentifier: c.zoneIdentifier,
        }),
      ],
    },
  },
  async run({ $ }) {
    const certificateID = this.certificateIdentifier;

    const response = await this.cloudflare.revokeCertificate(certificateID);
    $.export("$summary", `Successfully revoked certificate with ID ${response.result.id}`);

    return response;
  },
};

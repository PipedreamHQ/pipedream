import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-revoke-certificate",
  name: "Revoke Certificate",
  description: "Revoke an existing Origin CA certificate by its serial number. [See the documentation](https://developers.cloudflare.com/api/node/resources/origin_ca_certificates/methods/delete/)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
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
    const {
      cloudflare,
      certificateIdentifier,
    } = this;

    const response = await cloudflare.revokeCertificate(certificateIdentifier);
    $.export("$summary", `Successfully revoked certificate with ID \`${response.result.id}\``);

    return response;
  },
};

import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-list-certificates",
  name: "List Certificates",
  description: "List all existing Origin CA certificates for a given zone. [See the documentation](https://developers.cloudflare.com/api/node/resources/origin_ca_certificates/methods/list/)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const {
      cloudflare,
      zoneIdentifier,
    } = this;

    const response = await cloudflare.getCertificates({
      zone_id: zoneIdentifier,
    });
    $.export("$summary", "Certificates successfully retrieved");

    return response;
  },
};

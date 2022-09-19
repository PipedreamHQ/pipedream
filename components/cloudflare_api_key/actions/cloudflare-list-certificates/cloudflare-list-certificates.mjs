import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-list-certificates",
  name: "List Certificates",
  description: "List all existing Origin CA certificates for a given zone. [See the docs here](https://api.cloudflare.com/#origin-ca-list-certificates)",
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
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;

    const response = await this.cloudflare.getCertificates(zoneId);
    $.export("$summary", "Certificates successfully retrieved");

    return response;
  },
};

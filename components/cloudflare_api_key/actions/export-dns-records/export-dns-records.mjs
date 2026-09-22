import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-export-dns-records",
  name: "Export DNS Records",
  description: "Export a BIND config of a zone. [See the docs here](https://api.cloudflare.com/#dns-records-for-a-zone-export-dns-records)",
  version: "0.0.6",
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
  },
  async run({ $ }) {
    const response = await this.cloudflare.exportDnsRecords({
      zone_id: this.zoneIdentifier,
    });
    $.export("$summary", "Successfully exported BIND file");

    return response;
  },
};

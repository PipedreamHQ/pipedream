import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-delete-dns-record",
  name: "Delete DNS Record",
  description: "Deletes a DNS record of a zone. [See the docs here](https://api.cloudflare.com/#dns-records-for-a-zone-delete-dns-record)",
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
    dnsRecordIdentifier: {
      propDefinition: [
        cloudflare,
        "dnsRecordIdentifier",
        (c) => ({
          zoneIdentifier: c.zoneIdentifier,
        }),
      ],
    },
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;
    const dnsRecordID = this.dnsRecordIdentifier;

    const response = await this.cloudflare.deleteDnsRecord(zoneId, dnsRecordID);
    $.export("$summary", `Successfully deleted DNS record with ID ${dnsRecordID}`);

    return response;
  },
};

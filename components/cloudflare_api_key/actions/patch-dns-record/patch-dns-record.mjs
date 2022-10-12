import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-patch-dns-record",
  name: "Patch DNS Record",
  description: "Patches a DNS record of a zone. [See the docs here](https://api.cloudflare.com/#dns-records-for-a-zone-patch-dns-record)",
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
    dnsRecordType: {
      propDefinition: [
        cloudflare,
        "dnsRecordType",
      ],
      optional: true,
    },
    dnsRecordName: {
      propDefinition: [
        cloudflare,
        "dnsName",
      ],
      optional: true,
    },
    dnsRecordContent: {
      propDefinition: [
        cloudflare,
        "dnsRecordContent",
      ],
      optional: true,
    },
    dnsRecordTtl: {
      propDefinition: [
        cloudflare,
        "dnsRecordTtl",
      ],
      optional: true,
    },
    dnsRecordProxied: {
      propDefinition: [
        cloudflare,
        "dnsRecordProxied",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;
    const dnsRecordID = this.dnsRecordIdentifier;
    const dnsRecordData = {
      type: this.dnsRecordType,
      name: this.dnsRecordName,
      content: this.dnsRecordContent,
      ttl: this.dnsRecordTtl,
      proxied: this.dnsRecordProxied,
    };

    const response = await this.cloudflare.patchDnsRecord(zoneId, dnsRecordID, dnsRecordData);
    $.export("$summary", `Successfully patched DNS record with ID ${response.result.id}`);

    return response;
  },
};

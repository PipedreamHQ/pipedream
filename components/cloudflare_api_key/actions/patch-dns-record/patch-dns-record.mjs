import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-patch-dns-record",
  name: "Patch DNS Record",
  description: "Patches a DNS record of a zone. [See the docs here](https://api.cloudflare.com/#dns-records-for-a-zone-patch-dns-record)",
  version: "0.0.5",
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
    const {
      cloudflare,
      zoneIdentifier,
      dnsRecordIdentifier,
      dnsRecordType,
      dnsRecordName,
      dnsRecordContent,
      dnsRecordTtl,
      dnsRecordProxied,
    } = this;

    const response = await cloudflare.patchDnsRecord({
      zone_id: zoneIdentifier,
      dnsRecordId: dnsRecordIdentifier,
      type: dnsRecordType,
      name: dnsRecordName,
      content: dnsRecordContent,
      ttl: dnsRecordTtl,
      proxied: dnsRecordProxied,
    });
    $.export("$summary", `Successfully patched DNS record with ID ${response.result.id}`);

    return response;
  },
};

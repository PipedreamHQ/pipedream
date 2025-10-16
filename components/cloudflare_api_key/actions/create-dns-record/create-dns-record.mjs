import app from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-create-dns-record",
  name: "Create DNS Record",
  description: "Creates a DNS Record given its zone id",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    zoneId: {
      propDefinition: [
        app,
        "zoneIdentifier",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "DNS record name.",
    },
    type: {
      propDefinition: [
        app,
        "dnsRecordType",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "DNS record content.",
    },
    ttl: {
      type: "integer",
      label: "TTL",
      description: "Time to live for DNS record. Value of 1 is 'automatic'.",
    },
    proxied: {
      type: "boolean",
      label: "Proxied",
      description: "Whether the record is receiving the performance and security benefits of Cloudflare",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      zoneId,
      name,
      type,
      content,
      ttl,
      proxied,
    } = this;

    const response = await app.createDnsRecord({
      zone_id: zoneId,
      name,
      type,
      content,
      ttl,
      proxied,
    });

    $.export("$summary", "Successfully created DNS record");

    return response;
  },
};

// legacy_hash_id: a_K5iLqd
import { axios } from "@pipedream/platform";

export default {
  key: "cloudflare_api_key-cloudflare-create-dns-record",
  name: "Create DNS Record",
  description: "Creates a DNS Record given its zone id",
  version: "0.1.1",
  type: "action",
  props: {
    cloudflare_api_key: {
      type: "app",
      app: "cloudflare_api_key",
    },
    zone_id: {
      type: "string",
      description: "The zone ID where the DNS record being created belongs to.",
    },
    type: {
      type: "string",
      description: "DNS record type.",
      options: [
        "A",
        "AAAA",
        "CNAME",
        "TXT",
        "SRV",
        "LOC",
        "MX",
        "NS",
        "SPF",
        "CERT",
        "DNSKEY",
        "NAPTR",
        "SMIMEA",
        "SSHFP",
        "TLSA",
        "URI",
        "NS",
      ],
    },
    name: {
      type: "string",
      description: "DNS record name.",
    },
    content: {
      type: "string",
      description: "DNS record content.",
    },
    ttl: {
      type: "integer",
      description: "Time to live for DNS record. Value of 1 is 'automatic'.",
    },
    proxied: {
      type: "boolean",
      description: "Whether the record is receiving the performance and security benefits of Cloudflare",
      optional: true,
    },
    priority: {
      type: "string",
      description: "Used with some records like MX and SRV to determine priority. If you do not supply a priority for an MX record, a default value of 0 will be set.",
      optional: true,
    },
  },
  async run({ $ }) {

    return await axios($, {
      method: "post",
      url: `https://api.cloudflare.com/client/v4/zones/${this.zone_id}/dns_records`,
      headers: {
        "X-Auth-Email": `${this.cloudflare_api_key.$auth.Email}`,
        "X-Auth-Key": `${this.cloudflare_api_key.$auth.API_Key}`,
        "Content-Type": "application/json",

      },
      data: {
        type: this.type,
        name: this.name,
        content: this.content,
        ttl: this.ttl,
        proxied: this.proxied,
        priority: this.priority,
      },
    });
  },
};

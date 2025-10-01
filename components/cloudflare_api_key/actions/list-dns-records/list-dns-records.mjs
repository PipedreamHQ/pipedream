import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloudflare_api_key-list-dns-records",
  name: "List DNS Records",
  description: "List, search, sort, and filter a zones' DNS records. [See the docs here](https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cloudflare,
    zoneId: {
      propDefinition: [
        cloudflare,
        "zoneIdentifier",
      ],
    },
    match: {
      type: "string",
      label: "Match",
      description: "Whether to match all search requirements or at least one (any)",
      options: constants.DNS_RECORD_MATCH_OPTIONS,
      optional: true,
    },
    name: {
      propDefinition: [
        cloudflare,
        "dnsName",
      ],
      optional: true,
    },
    content: {
      propDefinition: [
        cloudflare,
        "dnsRecordContent",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        cloudflare,
        "dnsRecordType",
      ],
      optional: true,
    },
    proxied: {
      propDefinition: [
        cloudflare,
        "dnsRecordProxied",
      ],
      description: "DNS record proxied status",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      cloudflare,
      zoneId,
      match,
      name,
      content,
      type,
      proxied,
    } = this;

    let page = 1;
    const dnsRecords = [];
    let tempDnsRecords;
    do {
      tempDnsRecords = await cloudflare.listDnsRecords({
        zone_id: zoneId,
        match,
        name,
        content,
        type,
        proxied,
        page,
      });
      dnsRecords.push(...tempDnsRecords.result);
      page++;
    } while (tempDnsRecords.result_info.total_count > 0);

    $.export("$summary", "DNS records successfully retrieved");

    return dnsRecords;
  },
};

import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloudflare_api_key-list-dns-records",
  name: "List DNS Records",
  description: "List, search, sort, and filter a zones' DNS records. [See the docs here](https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records)",
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
    dnsRecordType: {
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
    const zoneId = this.zoneIdentifier;
    const dnsRecordData = {
      match: this.match,
      name: this.name,
      content: this.content,
      type: this.dnsRecordType,
      proxied: this.proxied,
    };

    let page = 1;
    const dnsRecords = [];
    let tempDnsRecords;
    do {
      tempDnsRecords = await this.cloudflare.listDnsRecords(zoneId, {
        ...dnsRecordData,
        page,
      });
      dnsRecords.push(...tempDnsRecords.result);
      page++;
    } while (tempDnsRecords.result_info.total_count > 0);

    $.export("$summary", "DNS records successfully retrieved");

    return dnsRecords;
  },
};

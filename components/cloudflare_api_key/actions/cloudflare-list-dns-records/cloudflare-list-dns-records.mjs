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
    order: {
      type: "string",
      label: "Order",
      description: "Field to order records by",
      options: constants.DNS_RECORD_ORDER_OPTIONS,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number of paginated results",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of DNS records per page",
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
    dnsRecordDirection: {
      type: "string",
      label: "Direction",
      description: "Direction to order domains",
      options: constants.DNS_RECORD_DIRECTION_OPTIONS,
      optional: true,
    },
  },
  async run() {
    const zoneId = this.zoneIdentifier;
    const dnsRecordData = {
      match: this.match,
      name: this.name,
      order: this.order,
      page: this.page,
      per_page: this.perPage,
      content: this.content,
      type: this.dnsRecordType,
      proxied: this.proxied,
      direction: this.dnsRecordDirection,
    };

    const response = await this.cloudflare.listDnsRecords(zoneId, dnsRecordData);

    return response;
  },
};

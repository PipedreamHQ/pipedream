import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../common/constants.mjs";

const {
  ANY: DNS_RECORD_MATCH_ANY,
  ALL: DNS_RECORD_MATCH_ALL,
} = constants.DNS_RECORD_MATCHES;

const {
  TYPE: DNS_RECORD_ORDER_TYPE,
  NAME: DNS_RECORD_ORDER_NAME,
  CONTENT: DNS_RECORD_ORDER_CONTENT,
  TLL: DNS_RECORD_ORDER_TLL,
  PROXIED: DNS_RECORD_ORDER_PROXIED,
} = constants.DNS_RECORD_ORDER;

const {
  ASC: DNS_RECORD_DIRECTION_ASC,
  DESC: DNS_RECORD_DIRECTION_DESC,
} = constants.DNS_RECORD_DIRECTION;

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
      options() {
        return [
          {
            label: "Any",
            value: DNS_RECORD_MATCH_ANY,
          },
          {
            label: "All",
            value: DNS_RECORD_MATCH_ALL,
          },
        ];
      },
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
      options() {
        return [
          {
            label: "Type",
            value: DNS_RECORD_ORDER_TYPE,
          },
          {
            label: "Name",
            value: DNS_RECORD_ORDER_NAME,
          },
          {
            label: "Content",
            value: DNS_RECORD_ORDER_CONTENT,
          },
          {
            label: "TTL",
            value: DNS_RECORD_ORDER_TLL,
          },
          {
            label: "Proxied",
            value: DNS_RECORD_ORDER_PROXIED,
          },
        ];
      },
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
      options() {
        return [
          {
            label: "Asc",
            value: DNS_RECORD_DIRECTION_ASC,
          },
          {
            label: "Desc",
            value: DNS_RECORD_DIRECTION_DESC,
          },
        ];
      },
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

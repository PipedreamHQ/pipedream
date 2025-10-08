import viewdnsInfo from "../../viewdns_info.app.mjs";

export default {
  key: "viewdns_info-dns-record-lookup",
  name: "DNS Record Lookup",
  description: "Performs a DNS record lookup to retrieve various DNS record types for a domain. [See the documentation](https://viewdns.info/api/dns-record-lookup/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    viewdnsInfo,
    domain: {
      type: "string",
      label: "Domain",
      description: "The hostname to retrieve DNS records for (e.g., example.com).",
    },
    recordType: {
      type: "string",
      label: "Record Type",
      description: "The type of DNS record to retrieve (e.g., A,AAAA,MX,TXT,ANY).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.viewdnsInfo.dnsLookup({
      $,
      params: {
        domain: this.domain,
        recordtype: this.recordType,
      },
    });

    $.export("$summary", `Retrieved DNS records for ${this.domain}.`);

    return response;
  },
};

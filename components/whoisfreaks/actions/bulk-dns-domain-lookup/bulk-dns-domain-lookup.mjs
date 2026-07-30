// x-pd-ai: optimized
import whoisfreaks from "../../whoisfreaks.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "whoisfreaks-bulk-dns-domain-lookup",
  name: "Bulk DNS Domain Lookup",
  description: "Retrieve DNS records (A, AAAA, MX, NS, CNAME, TXT, PTR, SPF, DKIM, DMARC, SRV, SOA) for up to 100 domains or IP addresses in a single request. Use this action for bulk DNS auditing, infrastructure mapping, or automated monitoring. Accepts domain names and/or IP addresses; returns JSON or XML output. [See the documentation](https://whoisfreaks.com/documentation/dns-checker-api#bulk-domain-lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    whoisfreaks,
    domainNames: {
      propDefinition: [whoisfreaks, "domainNames"],
      optional: true,
    },
    ipAddresses: {
      propDefinition: [whoisfreaks, "ipAddresses"],
      optional: true,
    },
    format: {
      propDefinition: [whoisfreaks, "format"],
    },
  },

  async run({ $ }) {
    const domainNames = this.domainNames
      ? parseObject(this.domainNames)
      : [];

    const ipAddresses = this.ipAddresses
      ? parseObject(this.ipAddresses)
      : [];

    if (!domainNames.length && !ipAddresses.length) {
      throw new ConfigurationError(
        "Please provide at least one domain name or IP address."
      );
    }

    const response = await this.whoisfreaks.lookupBulkDnsDomain({
      $,
      params: {
        format: this.format,
        type: "all",
      },
      body: {
        ...(domainNames.length && { domainNames }),
        ...(ipAddresses.length && { ipAddresses }),
      },
    });

    $.export(
      "$summary",
      `Successfully fetched bulk DNS data for ${
        domainNames.length + ipAddresses.length
      } input(s)`
    );

    return response;
  },
};

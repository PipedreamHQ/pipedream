// x-pd-ai: optimized
import whoisfreaks from "../../whoisfreaks.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
    key: "whoisfreaks-bulk-whois-lookup",
    name: "Bulk Whois Lookup",
    description: "Retrieve WHOIS registration data (registrant, registrar, name servers, email, phone, address, ASN, history) for up to 100 domains in a single request. Accepts comma-separated domain names across 1000+ TLDs; returns JSON or XML output. Use this action for bulk domain research, lead enrichment, or portfolio audits. [See the documentation](https://whoisfreaks.com/documentation/bulk-whois-api)",
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
        },
        format: {
            propDefinition: [whoisfreaks, "format"],
        },
    },
    async run({ $ }) {
        const domainNames = parseObject(this.domainNames);
        const response = await this.whoisfreaks.lookupBulkWhois({
            $,
            params: {
                format: this.format,
            },
            body: {
                domainNames,
            },
        });
        $.export("$summary", `Successfully fetched bulk WHOIS data for ${domainNames.length} domain(s)`);
        return response;
    },
};
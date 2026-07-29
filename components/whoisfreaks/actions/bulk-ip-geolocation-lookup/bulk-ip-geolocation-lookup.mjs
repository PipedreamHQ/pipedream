// x-pd-ai: optimized
import whoisfreaks from "../../whoisfreaks.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
    key: "whoisfreaks-bulk-ip-geolocation-lookup",
    name: "Bulk IP Geolocation Lookup",
    description: "Retrieve geolocation details (country, city, ASN, ISP, coordinates) for up to 100 IP addresses in a single request. Accepts comma-separated IPv4 or IPv6 addresses and returns JSON or XML output. Use this action for bulk network analysis, fraud detection, or audience geo-enrichment. [See the documentation](https://whoisfreaks.com/documentation/ip-geolocation-api#bulk-geo-lookup)",
    version: "0.0.1",
    annotations: {
        destructiveHint: false,
        openWorldHint: true,
        readOnlyHint: true,
    },
    type: "action",
    props: {
        whoisfreaks,
        ipAddresses: {
            propDefinition: [whoisfreaks, "ipAddresses"],
            optional: false,
        },
        format: {
            propDefinition: [whoisfreaks, "format"],
        },
    },
    async run({ $ }) {
        const ipAddresses = parseObject(this.ipAddresses);
        const response = await this.whoisfreaks.lookupBulkIpGeolocation({
            $,
            params: {
                format: this.format,
            },
            body: {
                ips: ipAddresses,
            },
        });
        $.export("$summary", `Successfully fetched bulk IP geolocation data for ${ipAddresses.length} IP(s)`);
        return response;
    },
};
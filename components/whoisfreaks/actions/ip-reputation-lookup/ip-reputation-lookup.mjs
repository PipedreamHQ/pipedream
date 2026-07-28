import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
    key: "whoisfreaks-ip-reputation-lookup",
    name: "IP Reputation Lookup",
    description: "Score a single IPv4 or IPv6 address against real-time threat data. Returns a composite threat score (0-100), VPN/proxy/Tor/bot classification, provider names with confidence scores, district-level geolocation, and ASN/ISP details. Use this action for threat intelligence, access control, or fraud prevention workflows. Accepts JSON or XML output. [See the documentation](https://whoisfreaks.com/documentation/ip-security-api#security-lookup)",
    version: "0.0.1",
    annotations: {
        destructiveHint: false,
        openWorldHint: true,
        readOnlyHint: true,
    },
    type: "action",
    props: {
        whoisfreaks,
        ipAddress: {
            propDefinition: [whoisfreaks, "ip"],
        },
    },
    async run({ $ }) {
        const response = await this.whoisfreaks.lookupIpReputation({
            $,
            params: {
                ip: this.ipAddress,
            },
        });
        $.export("$summary", `Successfully fetched IP reputation data for ${this.ipAddress}`);
        return response;
    },
};


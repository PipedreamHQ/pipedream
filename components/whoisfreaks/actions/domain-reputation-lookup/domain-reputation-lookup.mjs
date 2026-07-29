// x-pd-ai: optimized
import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
    key: "whoisfreaks-domain-reputation-lookup",
    name: "Domain Reputation Lookup",
    description: "Check the reputation and security status of a domain — including whether it is associated with malware, phishing campaigns, or other malicious activity. Use this action for threat intelligence workflows, email security checks, or domain risk scoring. Returns JSON output. [See the documentation](https://whoisfreaks.com/documentation/domain-reputation-api)",
    version: "0.0.1",
    annotations: {
        destructiveHint: false,
        openWorldHint: true,
        readOnlyHint: true,
    },
    type: "action",
    props: {
        whoisfreaks,
        domainName: {
            propDefinition: [whoisfreaks, "domainName"],
        },
    },
    async run({ $ }) {
        const response = await this.whoisfreaks.lookupDomainReputation({
            $,
            params: {
                domainName: this.domainName,
            },
        });
        $.export("$summary", `Successfully fetched domain reputation data for ${this.domainName}`);
        return response;
    },
};

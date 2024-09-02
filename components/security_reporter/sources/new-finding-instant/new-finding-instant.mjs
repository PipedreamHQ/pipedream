import { axios } from "@pipedream/platform";
import securityReporter from "../../security_reporter.app.mjs";

export default {
  key: "security_reporter-new-finding-instant",
  name: "New Finding Created",
  description: "Emit new event when a finding is created. [See the documentation](https://trial3.securityreporter.app/api-documentation)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    securityReporter,
    name: {
      propDefinition: [
        securityReporter,
        "name",
      ],
    },
    mode: {
      propDefinition: [
        securityReporter,
        "mode",
      ],
    },
    includes: {
      propDefinition: [
        securityReporter,
        "includes",
      ],
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const findings = await this.securityReporter.listFindings();
      findings.slice(0, 50).forEach((finding) => {
        this.$emit(finding, {
          summary: `New Finding: ${finding.title}`,
          id: finding.id,
          ts: Date.parse(finding.created_at),
        });
      });
    },
    async activate() {
      // Implement webhook subscription if available
    },
    async deactivate() {
      // Implement webhook unsubscription if available
    },
  },
  methods: {
    async processFindings() {
      const findings = await this.securityReporter.listFindings();
      findings.forEach((finding) => {
        this.$emit(finding, {
          summary: `New Finding: ${finding.title}`,
          id: finding.id,
          ts: Date.parse(finding.created_at),
        });
      });
    },
  },
  async run() {
    await this.processFindings();
  },
};

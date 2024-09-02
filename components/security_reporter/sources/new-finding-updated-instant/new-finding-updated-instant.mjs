import { axios } from "@pipedream/platform";
import securityReporter from "../../security_reporter.app.mjs";

export default {
  key: "security_reporter-new-finding-updated-instant",
  name: "New Finding Updated",
  description: "Emit new event when a finding is updated. [See the documentation](https://trial3.securityreporter.app/api-documentation)",
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
      // Emit historical events
      const findings = await this.securityReporter.listFindings();
      findings.slice(0, 50).forEach((finding) => {
        this.$emit(finding, {
          id: finding.id,
          summary: `Historical finding updated: ${finding.title}`,
          ts: new Date(finding.updatedAt).getTime(),
        });
      });
    },
    async activate() {
      // No webhook subscription needed for this source
    },
    async deactivate() {
      // No webhook subscription to delete for this source
    },
  },
  methods: {
    async emitEvent(type, opts = {}) {
      const {
        name, mode, includes,
      } = opts;
      const event = {
        type,
        name,
        mode,
        includes,
      };
      this.$emit(event, {
        summary: `New event: ${type}`,
        id: new Date().toISOString(),
      });
    },
  },
  async run() {
    const findings = await this.securityReporter.listFindings();
    findings.forEach((finding) => {
      this.$emit(finding, {
        id: finding.id,
        summary: `Finding updated: ${finding.title}`,
        ts: new Date(finding.updatedAt).getTime(),
      });
    });
  },
};

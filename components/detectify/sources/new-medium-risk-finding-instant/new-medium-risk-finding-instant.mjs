import detectify from "../../detectify.app.mjs";

export default {
  key: "detectify-new-medium-risk-finding-instant",
  name: "New Medium Risk Finding Instant",
  description: "Emit new event when a moderate security finding at a medium risk level is recognized. [See the documentation](https://developer.detectify.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    detectify,
    domain: {
      propDefinition: [
        detectify,
        "domain",
      ],
    },
    userKeys: {
      propDefinition: [
        detectify,
        "userKeys",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,  // 15 minutes
      },
    },
  },
  methods: {
    _getPrevToken() {
      return this.db.get("prevToken") || null;
    },
    _setPrevToken(token) {
      this.db.set("prevToken", token);
    },
  },
  async run() {
    const prevToken = this._getPrevToken();
    const findings = await this.detectify.getModerateSecurityFindings({
      domain: this.domain,
      userKeys: this.userKeys,
    });

    for (const finding of findings) {
      if (prevToken && finding.token <= prevToken) {
        continue;  // Skip findings that have already been processed
      }

      this.$emit(finding, {
        id: finding.token,
        summary: `New Medium Risk Finding: ${finding.title}`,
        ts: Date.parse(finding.created),
      });

      this._setPrevToken(finding.token);
    }
  },
};

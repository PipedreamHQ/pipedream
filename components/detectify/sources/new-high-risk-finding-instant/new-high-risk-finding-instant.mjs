import detectify from "../../detectify.app.mjs";

export default {
  key: "detectify-new-high-risk-finding-instant",
  name: "New High Risk Finding Instant",
  description: "Emit new event when a severe security finding at high risk level is detected.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    detectify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
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
  },
  methods: {
    _getStoredFindings() {
      return this.db.get("findings") || [];
    },
    _storeFindings(findings) {
      this.db.set("findings", findings);
    },
    _findingsAreEqual(a, b) {
      return a.id === b.id;
    },
    _isFindingNew(finding) {
      const storedFindings = this._getStoredFindings();
      return !storedFindings.some((storedFinding) => this._findingsAreEqual(storedFinding, finding));
    },
    _storeNewFindings(findings) {
      const storedFindings = this._getStoredFindings();
      const newFindings = [
        ...findings,
        ...storedFindings,
      ];
      this._storeFindings(newFindings);
    },
    _emitFinding(finding) {
      const {
        id, title, severity, status, found_at, target,
      } = finding;
      this.$emit(
        {
          id,
          title,
          severity,
          status,
          found_at,
          target,
        },
        {
          id,
          summary: title,
          ts: new Date(found_at).getTime(),
        },
      );
    },
  },
  async run() {
    const findings = await this.detectify.getSevereSecurityFindings({
      domain: this.domain,
      userKeys: this.userKeys,
    });
    const newFindings = findings.filter(this._isFindingNew.bind(this));
    newFindings.forEach(this._emitFinding.bind(this));
    this._storeNewFindings(newFindings);
  },
};

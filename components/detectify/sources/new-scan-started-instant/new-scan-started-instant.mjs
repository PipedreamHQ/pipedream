import detectify from "../../detectify.app.mjs";

export default {
  key: "detectify-new-scan-started-instant",
  name: "New Scan Started Instant",
  description: "Emits an event as soon as a new security scan on the entered domain commences",
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
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getScanStatus() {
      return this.detectify.getScanStatus({
        domain: this.domain,
        userKeys: this.userKeys,
      });
    },
    _isScanStarted(previousScanStatus, currentScanStatus) {
      return previousScanStatus !== "started" && currentScanStatus === "started";
    },
  },
  hooks: {
    async deploy() {
      const scanStatus = await this._getScanStatus();
      this.db.set("scanStatus", scanStatus.status);
    },
  },
  async run() {
    const previousScanStatus = this.db.get("scanStatus");
    const currentScanStatus = await this._getScanStatus();

    if (this._isScanStarted(previousScanStatus, currentScanStatus.status)) {
      this.$emit(
        {
          scanStatus: currentScanStatus,
        },
        {
          id: this.domain,
          summary: `New scan started for domain ${this.domain}`,
          ts: Date.now(),
        },
      );
    }

    this.db.set("scanStatus", currentScanStatus.status);
  },
};

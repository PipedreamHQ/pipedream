/* eslint-disable max-len */
import googlePostmasterToolsApi from "../../google_postmaster_tools_api.app.mjs";

export default {
  key: "google_postmaster_tools_api-new-matched-traffic-stats",
  name: "New Matched Traffic Stats",
  description: "Emits a new event when traffic stats match certain criteria. [See the documentation](https://developers.google.com/gmail/postmaster/reference/rest)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    googlePostmasterToolsApi,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 86400, // 24 hours
      },
    },
    domain: {
      propDefinition: [
        googlePostmasterToolsApi,
        "domain",
      ],
    },
    ipReputation: {
      propDefinition: [
        googlePostmasterToolsApi,
        "ipReputation",
      ],
    },
    domainReputation: {
      propDefinition: [
        googlePostmasterToolsApi,
        "domainReputation",
      ],
    },
    userReportedSpamRatio: {
      propDefinition: [
        googlePostmasterToolsApi,
        "userReportedSpamRatio",
      ],
    },
    spfSuccessRatio: {
      propDefinition: [
        googlePostmasterToolsApi,
        "spfSuccessRatio",
      ],
    },
    dkimSuccessRatio: {
      propDefinition: [
        googlePostmasterToolsApi,
        "dkimSuccessRatio",
      ],
    },
    dmarcSuccessRatio: {
      propDefinition: [
        googlePostmasterToolsApi,
        "dmarcSuccessRatio",
      ],
    },
    outboundEncryptionRatio: {
      propDefinition: [
        googlePostmasterToolsApi,
        "outboundEncryptionRatio",
      ],
    },
    inboundEncryptionRatio: {
      propDefinition: [
        googlePostmasterToolsApi,
        "inboundEncryptionRatio",
      ],
    },
    deliveryError: {
      propDefinition: [
        googlePostmasterToolsApi,
        "deliveryError",
      ],
    },
    errorRatio: {
      propDefinition: [
        googlePostmasterToolsApi,
        "errorRatio",
      ],
    },
  },
  methods: {
    async getTrafficStats() {
      const today = new Date();
      const oneDayAgo = new Date(today);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const endDate = today.toISOString().split("T")[0];
      const startDate = oneDayAgo.toISOString().split("T")[0];

      return await this.googlePostmasterToolsApi.getDomainTrafficStats({
        domainName: this.domain,
        startDate,
        endDate,
      });
    },
    matchesCriteria(stats) {
      if (this.ipReputation && stats.ipReputation !== this.ipReputation) return false;
      if (this.domainReputation && stats.domainReputation !== this.domainReputation) return false;
      if (this.userReportedSpamRatio && stats.userReportedSpamRatio < this.userReportedSpamRatio) return false;
      if (this.spfSuccessRatio && stats.spfSuccessRatio > this.spfSuccessRatio) return false;
      if (this.dkimSuccessRatio && stats.dkimSuccessRatio > this.dkimSuccessRatio) return false;
      if (this.dmarcSuccessRatio && stats.dmarcSuccessRatio > this.dmarcSuccessRatio) return false;
      if (this.outboundEncryptionRatio && stats.outboundEncryptionRatio > this.outboundEncryptionRatio) return false;
      if (this.inboundEncryptionRatio && stats.inboundEncryptionRatio > this.inboundEncryptionRatio) return false;
      if (this.deliveryError && !stats.deliveryErrors.some((error) => error.type === this.deliveryError)) return false;
      if (this.errorRatio && stats.errorRatio <= this.errorRatio) return false;
      return true;
    },
  },
  async run() {
    const stats = await this.getTrafficStats();
    stats.trafficStats.forEach((stat) => {
      if (this.matchesCriteria(stat)) {
        this.$emit(stat, {
          id: `${stat.domainName}-${stat.startDate}`,
          summary: `Matched Traffic Stat for ${stat.domainName}`,
          ts: Date.parse(stat.startDate),
        });
      }
    });
  },
};

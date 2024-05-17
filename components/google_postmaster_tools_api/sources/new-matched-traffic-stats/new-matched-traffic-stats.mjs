import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googlePostmasterToolsApi from "../../google_postmaster_tools_api.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "google_postmaster_tools_api-new-matched-traffic-stats",
  name: "New Matched Traffic Stats",
  description:
    "Emits a new event when traffic stats match certain criteria. [See the documentation](https://developers.google.com/gmail/postmaster/reference/rest)",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  props: {
    googlePostmasterToolsApi,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    domain: {
      propDefinition: [
        googlePostmasterToolsApi,
        "domain",
      ],
    },
    filterInfo: {
      type: "alert",
      alertType: "info",
      content: "By default, events will be emitted when matching **any** of the configured filters. If you want **all** configured filters to be required instead, you can use the `Match All Filters` prop below.",
    },
    matchAllFilters: {
      propDefinition: [
        googlePostmasterToolsApi,
        "matchAllFilters",
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
    errorRatio: {
      propDefinition: [
        googlePostmasterToolsApi,
        "errorRatio",
      ],
    },
    errorCategories: {
      propDefinition: [
        googlePostmasterToolsApi,
        "errorCategories",
      ],
    },
  },
  methods: {
    _getSavedItems() {
      return this.db.get("savedItems") ?? [];
    },
    _setSavedItems(value) {
      this.db.set("savedItems", value);
    },
    getDateValues(date) {
      const [
        year,
        month,
        day,
      ] = date.toISOString().split("T")[0].split("-").map((i) => Number(i));
      return {
        year,
        month,
        day,
      };
    },
    async getTrafficStats() {
      const today = new Date();
      const oneDayAgo = new Date(today);
      oneDayAgo.setDate(oneDayAgo.getDate() - 7);
      const endDate = this.getDateValues(today);
      const startDate = this.getDateValues(oneDayAgo);

      return this.googlePostmasterToolsApi.getDomainTrafficStats({
        domainName: this.domain,
        params: {
          "startDate.day": startDate.day,
          "startDate.month": startDate.month,
          "startDate.year": startDate.year,
          "endDate.day": endDate.day,
          "endDate.month": endDate.month,
          "endDate.year": endDate.year,
        },
      });
    },
    filterIpReputation(item) {
      let { ipReputation } = this;
      if (typeof ipReputation === "string")
        ipReputation = ipReputation.split(",");
      if (!ipReputation?.length) return undefined;
      return item.ipReputations.some(
        ({
          reputation, ipCount,
        }) =>
          ipReputation.includes(reputation) && ipCount > 0,
      );
    },
    filterDomainReputation(item) {
      let { domainReputation } = this;
      if (typeof domainReputation === "string")
        domainReputation = domainReputation.split(",");
      if (!domainReputation?.length) return undefined;
      return domainReputation.includes(item.domainReputation);
    },
    filterRatio(prop, value, greaterOrEqual = false) {
      if (prop?.endsWith("%")) prop = Number(prop.slice(0, -1)) / 100;
      const ratio = Number(prop);
      if (isNaN(ratio) || value === undefined) return undefined;
      return greaterOrEqual
        ? value >= ratio
        : value < ratio;
    },
    filterSpamRatio(item) {
      return this.filterRatio(
        this.userReportedSpamRatio,
        item.userReportedSpamRatio,
        true,
      );
    },
    filterSpfSuccessRatio(item) {
      return this.filterRatio(this.spfSuccessRatio, item.spfSuccessRatio);
    },
    filterDkimSuccessRatio(item) {
      return this.filterRatio(this.dkimSuccessRatio, item.dkimSuccessRatio);
    },
    filterDmarcSuccessRatio(item) {
      return this.filterRatio(this.dmarcSuccessRatio, item.dmarcSuccessRatio);
    },
    filterOutboundEncryptionRatio(item) {
      return this.filterRatio(
        this.outboundEncryptionRatio,
        item.outboundEncryptionRatio,
      );
    },
    filterInboundEncryptionRatio(item) {
      return this.filterRatio(
        this.inboundEncryptionRatio,
        item.inboundEncryptionRatio,
      );
    },
    filterErrorRatio(item) {
      const ratio = Number(this.errorRatio);
      if (isNaN(ratio)) return undefined;

      let { errorCategories } = this;
      if (typeof errorCategories === "string")
        errorCategories = errorCategories.split(",");

      return item.deliveryErrors.some(
        ({
          errorType, errorRatio,
        }) =>
          (!errorCategories || errorCategories.includes(errorType)) && errorRatio > ratio,
      );
    },
    matchesCriteria(item) {
      // Filters return undefined if the prop is not set, or true/false otherwise
      // Filters are a logical AND - if any filter returns false, the item is not emitted
      const filters = [
        this.filterIpReputation,
        this.filterDomainReputation,
        this.filterSpamRatio,
        this.filterSpfSuccessRatio,
        this.filterDkimSuccessRatio,
        this.filterDmarcSuccessRatio,
        this.filterOutboundEncryptionRatio,
        this.filterInboundEncryptionRatio,
        this.filterErrorRatio,
      ];

      let hasMatch = false;

      for (let filter of filters) {
        const result = filter(item);
        if (result === true) {
          if (!this.matchAllFilters) return true;
          hasMatch = true;
        } else if (result === false && this.matchAllFilters) {
          return false;
        }
      }

      return hasMatch;
    },
  },
  async run() {
    const savedItems = this._getSavedItems();
    const ts = Date.now();
    const stats = await this.getTrafficStats();
    stats?.trafficStats?.filter(({ name }) => !savedItems.includes(name)).forEach((item) => {
      const id = item.name;
      if (this.matchesCriteria(item)) {
        this.$emit(item, {
          id,
          summary: `Matched Traffic Stats: ${id}`,
          ts,
        });
        savedItems.push(id);
      }
    });
    this._setSavedItems(savedItems);
  },
};

import { axios } from "@pipedream/platform";
import drimify from "../../drimify.app.mjs";

export default {
  key: "drimify-new-application-data",
  name: "New Application Data Collected",
  description: "Emit new event when application data has been collected. [See the documentation](https://endpoint.drimify.com/api/docs?ui=re_doc)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    drimify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    applicationId: {
      propDefinition: [
        drimify,
        "applicationId",
      ],
    },
    timeFrame: {
      propDefinition: [
        drimify,
        "timeFrame",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const applicationData = await this.drimify.paginate(this.drimify.listAppDataCollections, {
        applicationId: this.applicationId,
        createdSince: this.timeFrame || undefined,
      });

      for (const data of applicationData.slice(0, 50).reverse()) {
        this.$emit(data, {
          id: data.idunic,
          summary: `New Data Collected: ${data.username || data.email || data.idunic}`,
          ts: new Date(data.updatedAt).getTime(),
        });
      }

      const lastTimestamp = applicationData[0]?.updatedAtTimestamp || 0;
      this._setLastTimestamp(lastTimestamp);
    },
    async activate() {
      // Implement if needed
    },
    async deactivate() {
      // Implement if needed
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const applicationData = await this.drimify.paginate(this.drimify.listAppDataCollections, {
      applicationId: this.applicationId,
      createdSince: new Date(lastTimestamp * 1000).toISOString(),
    });

    for (const data of applicationData) {
      if (Date.parse(data.updatedAt) > lastTimestamp) {
        this.$emit(data, {
          id: data.idunic,
          summary: `New Data Collected: ${data.username || data.email || data.idunic}`,
          ts: new Date(data.updatedAt).getTime(),
        });
      }
    }

    if (applicationData.length > 0) {
      this._setLastTimestamp(applicationData[0].updatedAtTimestamp || 0);
    }
  },
};

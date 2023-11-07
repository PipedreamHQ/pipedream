import codereadr from "../../codereadr.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "codereadr-new-scan",
  name: "New Scan",
  description: "Emit new event when there is a new scan. [See the documentation](https://secure.codereadr.com/apidocs/scans.md)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    codereadr,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    status: {
      propDefinition: [
        codereadr,
        "status",
      ],
    },
  },
  methods: {
    _getLastScanTimestamp() {
      return this.db.get("lastScanTimestamp") || 0;
    },
    _setLastScanTimestamp(lastScanTimestamp) {
      this.db.set("lastScanTimestamp", lastScanTimestamp);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the most recent scans during the first run
      const lastScanTimestamp = this._getLastScanTimestamp();
      const params = {
        ...(this.status && {
          status: this.status,
        }),
      };
      const scans = await this.codereadr._makeRequest({
        path: "/scans",
        params,
      });

      // Emit at most 50 most recent scans
      const recentScans = scans.slice(0, 50);
      for (const scan of recentScans) {
        this.$emit(scan, {
          id: scan.id,
          summary: `New Scan: ${scan.value}`,
          ts: Date.parse(scan.created_at),
        });
      }

      // Store the timestamp of the last scan
      if (recentScans.length > 0) {
        const lastScanTimestamp = Date.parse(recentScans[0].created_at);
        this._setLastScanTimestamp(lastScanTimestamp);
      }
    },
  },
  async run() {
    // Fetch new scans since the last scan timestamp
    const lastScanTimestamp = this._getLastScanTimestamp();
    const params = {
      ...(this.status && {
        status: this.status,
      }),
      ...(lastScanTimestamp && {
        since: lastScanTimestamp,
      }),
    };

    const scans = await this.codereadr._makeRequest({
      path: "/scans",
      params,
    });

    // Emit new scans and update the last scan timestamp
    for (const scan of scans) {
      this.$emit(scan, {
        id: scan.id,
        summary: `New Scan: ${scan.value}`,
        ts: Date.parse(scan.created_at),
      });
    }

    if (scans.length > 0) {
      const lastScanTimestamp = Date.parse(scans[0].created_at);
      this._setLastScanTimestamp(lastScanTimestamp);
    }
  },
};

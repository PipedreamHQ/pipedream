import grist from "../../grist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grist-new-or-updated-record-instant",
  name: "New or Updated Record (Instant)",
  description: "Emit an event once a record is updated or newly created in Grist. [See the documentation](https://support.getgrist.com/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    grist,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const recentRecords = await this.grist.getRecentRecords({
        tableName: this.db.get("lastTableName"),
      });

      recentRecords.slice(-50).forEach((record) => {
        this.$emit(record, {
          id: record.id,
          summary: `New or updated record in table ${record.tableName}`,
          ts: Date.parse(record.updatedAt) || Date.now(),
        });
      });
    },
    async activate() {
      // Activation does not require specific actions for this source
    },
    async deactivate() {
      // Deactivation does not require specific actions for this source
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (body && (headers["X-Grist-Event"] === "records:created" || headers["X-Grist-Event"] === "records:updated")) {
      this.$emit(body, {
        id: body.id || `${Date.now()}-${Math.random()}`,
        summary: `New or updated record in table ${body.tableName}`,
        ts: body.ts || Date.now(),
      });

      this.http.respond({
        status: 200,
        body: "Event processed",
      });

    } else {
      this.http.respond({
        status: 400,
        body: "Invalid event data",
      });
    }
  },
};

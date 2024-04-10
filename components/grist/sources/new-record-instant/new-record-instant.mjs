import grist from "../../grist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grist-new-record-instant",
  name: "New Record Instant",
  description: "Emit a new event when a record is just created. [See the documentation](https://support.getgrist.com/api/)",
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
      // Fetch the 50 most recent records to backfill events upon deployment
      const recentRecords = await this.grist.getRecentRecords({
        tableName: "Table_Name", // Replace with actual table name
        limit: 50,
      });
      for (const record of recentRecords) {
        this.$emit(record, {
          id: record.id,
          summary: `New record created with ID: ${record.id}`,
          ts: Date.parse(record.createdAt) || +new Date(),
        });
      }
    },
    async activate() {
      // Activation logic, such as setting up a webhook, would go here
    },
    async deactivate() {
      // Deactivation logic, such as removing a webhook, would go here
    },
  },
  async run(event) {
    const { body } = event;

    // Emit the new record that was just created
    this.$emit(body, {
      id: body.id,
      summary: `New record created with ID: ${body.id}`,
      ts: Date.parse(body.createdAt) || +new Date(),
    });

    // Respond to the HTTP request if necessary
    this.http.respond({
      status: 200,
      body: "Event received",
    });
  },
};

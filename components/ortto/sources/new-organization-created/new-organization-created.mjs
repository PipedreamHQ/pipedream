import { axios } from "@pipedream/platform";
import ortto from "../../ortto.app.mjs";

export default {
  key: "ortto-new-organization-created",
  name: "New Organization Created",
  description:
    "Emit new event when a new organization is created in your Ortto account. [See the documentation](https://help.ortto.com/developer/latest/api-reference/organizations/index.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ortto,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling interval",
      description: "How often to poll the endpoint",
      default: {
        intervalSeconds: 60,
      },
    },
    lastRecordFetchTs: {
      type: "string",
      label: "Last Record Fetch Timestamp",
      description:
        "Timestamp of the last fetched record, used to fetch only new records.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const organizations = await this.ortto.getNewOrganizations();
      organizations.slice(-50).forEach((organization) => {
        this.$emit(organization, {
          id: organization.id,
          summary: `New Organization: ${
            organization.fields?.["str:o:industry"] || "No industry"
          }`,
          ts: Date.now(),
        });
      });
    },
    async activate() {
      // Placeholder for potential webhook activation logic
    },
    async deactivate() {
      // Placeholder for potential webhook deactivation logic
    },
  },
  async run() {
    const lastRecordFetchTs =
      this.db.get("lastRecordFetchTs") || new Date(0).toISOString();
    const newOrganizations = await this.ortto.getNewOrganizations({
      params: {
        sort_order: "asc",
        sort_by_field_id: "created_at",
        limit: 50,
        q: `created_at>"${lastRecordFetchTs}"`,
      },
    });

    if (newOrganizations.length) {
      const mostRecentTimestamp = new Date(
        newOrganizations[newOrganizations.length - 1].created_at,
      ).toISOString();

      newOrganizations.forEach((organization) => {
        this.$emit(organization, {
          id: organization.id,
          summary: `New Organization: ${
            organization.fields?.["str:o:industry"] || "No industry"
          }`,
          ts: Date.now(),
        });
      });

      this.db.set("lastRecordFetchTs", mostRecentTimestamp);
    }
  },
};

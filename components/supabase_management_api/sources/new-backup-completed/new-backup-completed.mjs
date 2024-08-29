import supabaseManagementApi from "../../supabase_management_api.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "supabase_management_api-new-backup-completed",
  name: "New Backup Completed",
  description: "Emit new event when a database backup is completed for a project. [See the documentation](https://supabase.com/docs/reference/api/v1-list-all-backups)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    supabaseManagementApi,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectRef: {
      propDefinition: [
        supabaseManagementApi,
        "projectRef",
      ],
    },
  },
  methods: {
    generateMeta(backup) {
      return {
        id: backup.inserted_at,
        summary: "New Backup Completed",
        ts: Date.now(),
      };
    },
  },
  async run() {
    const backups = await this.supabaseManagementApi.listDatabaseBackups({
      projectRef: this.projectRef,
    });

    if (!backups?.length) {
      return;
    }

    for (const backup of backups) {
      if (backup.status === "COMPLETED") {
        const meta = this.generateMeta(backup);
        this.$emit(backup, meta);
      }
    }
  },
};

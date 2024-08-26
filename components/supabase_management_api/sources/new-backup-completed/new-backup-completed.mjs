import axios from "@pipedream/platform";
import supabaseManagementApi from "../../supabase_management_api.app.mjs";

export default {
  key: "supabase_management_api-new-backup-completed",
  name: "New Backup Completed",
  description: "Emits a new event when a database backup is completed for a project. [See the documentation](https://supabase.com/docs/reference/api/introduction)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    supabase_management_api: {
      type: "app",
      app: "supabase_management_api",
    },
    projectRef: {
      propDefinition: [
        supabaseManagementApi,
        "projectRef",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,  // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Get most recent backups
      const backups = await this.supabaseManagementApi.listDatabaseBackups(this.projectRef);
      // Sort them by inserted_at date
      backups.backups.sort((a, b) => new Date(b.inserted_at) - new Date(a.inserted_at));
      // Store the most recent backup's inserted_at date
      this.db.set("lastBackupDate", new Date(backups.backups[0].inserted_at));
    },
  },
  async run() {
    // Get all backups
    const backups = await this.supabaseManagementApi.listDatabaseBackups(this.projectRef);
    // Sort them by inserted_at date
    backups.backups.sort((a, b) => new Date(b.inserted_at) - new Date(a.inserted_at));
    // Get the last backup date we have stored
    const lastBackupDate = new Date(this.db.get("lastBackupDate"));
    // Filter for any new backups since our last stored backup date
    const newBackups = backups.backups.filter((backup) => new Date(backup.inserted_at) > lastBackupDate);
    // If we have new backups
    if (newBackups.length > 0) {
      // Store the most recent backup's inserted_at date
      this.db.set("lastBackupDate", new Date(newBackups[0].inserted_at));
      // Emit each new backup
      newBackups.forEach((backup) => {
        this.$emit(backup, {
          id: backup.inserted_at,
          summary: `New Backup Completed: ${backup.inserted_at}`,
          ts: Date.parse(backup.inserted_at),
        });
      });
    }
  },
};

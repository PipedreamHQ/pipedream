import { axios } from "@pipedream/platform";
import egnyte from "../../egnyte.app.mjs";

export default {
  key: "egnyte-list-folders",
  name: "List Shared Folders",
  description: "Emit a new event for each folder in the '/shared' directory. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    egnyte,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      try {
        const folders = await this.egnyte.listFolders({
          folderPath: "/shared",
        });
        const recentFolders = folders.slice(0, 50);
        const folderIds = [];

        for (const folder of recentFolders) {
          this.$emit(folder, {
            id: folder.id,
            summary: `Folder: ${folder.name}`,
            ts: folder.modified_at
              ? Date.parse(folder.modified_at)
              : Date.now(),
          });
          folderIds.push(folder.id);
        }

        this.db.set("folderIds", folderIds);
      } catch (error) {
        this.$emit(error, {
          summary: "Error during deploy",
          ts: Date.now(),
        });
      }
    },
    async activate() {
      // No webhook to create for polling source
    },
    async deactivate() {
      // No webhook to delete for polling source
    },
  },
  async run() {
    try {
      const savedFolderIds = this.db.get("folderIds") || [];
      const folders = await this.egnyte.listFolders({
        folderPath: "/shared",
      });
      const newFolderIds = [];

      for (const folder of folders) {
        if (!savedFolderIds.includes(folder.id)) {
          this.$emit(folder, {
            id: folder.id,
            summary: `New Folder: ${folder.name}`,
            ts: folder.modified_at
              ? Date.parse(folder.modified_at)
              : Date.now(),
          });
          newFolderIds.push(folder.id);
        }
      }

      if (newFolderIds.length > 0) {
        const allFolderIds = [
          ...savedFolderIds,
          ...newFolderIds,
        ];
        this.db.set("folderIds", allFolderIds);
      }
    } catch (error) {
      this.$emit(error, {
        summary: "Error during run",
        ts: Date.now(),
      });
    }
  },
};

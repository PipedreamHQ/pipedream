import egnyte from "../../egnyte.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    egnyte,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    folderPath: {
      type: "string",
      label: "Folder Path",
      description: "The folder path (example: `/Shared/Documents`) to watch for updates.",
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getResourceType() {
      throw new Error("getResourceType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    emitEvents(items) {
      items.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const resourceType = this.getResourceType();

    // Recursively process folder and subfolders
    const processFolder = async (folderPath) => {
      const results = await this.egnyte.getFolder({
        folderPath,
        params: {
          sort_by: "last_modified",
          sort_direction: "descending",
        },
      });

      const items = results[resourceType];
      if (!items?.length) {
        return;
      }
      const newItems = [];

      for (const item of items) {
        const ts = item.uploaded;
        if (ts >= lastTs) {
          newItems.push(item);
          maxTs = Math.max(ts, maxTs);
        }
      }

      const folders = results.folders;
      if (folders?.length) {
        for (const folder of folders) {
          await processFolder(folder.path);
        }
      }

      await this.emitEvents(newItems);
    };

    await processFolder(this.folderPath);

    this._setLastTs(maxTs);
  },
};

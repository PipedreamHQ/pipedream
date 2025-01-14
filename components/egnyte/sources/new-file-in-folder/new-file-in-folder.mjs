import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import egnyte from "../../egnyte.app.mjs";

export default {
  key: "egnyte-new-file-in-folder",
  name: "New File in Folder",
  description: "Emits a new event when a file is added to a specified folder in Egnyte. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    egnyte,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    monitoredFolderPath: {
      propDefinition: [
        egnyte,
        "monitoredFolderPath",
      ],
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") ?? 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const files = await this.egnyte.monitorFolder({
        folderPath: this.monitoredFolderPath,
      });
      const sortedFiles = files.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
      const recentFiles = sortedFiles.slice(0, 50);

      for (const file of recentFiles) {
        this.$emit(
          file,
          {
            id: file.id,
            summary: `New file: ${file.name}`,
            ts: new Date(file.modified).getTime(),
          },
        );
      }

      if (recentFiles.length > 0) {
        const latestTimestamp = new Date(recentFiles[0].modified).getTime();
        this._setLastTimestamp(latestTimestamp);
      }
    },
    async activate() {
      // No activation steps required for polling source
    },
    async deactivate() {
      // No deactivation steps required for polling source
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const files = await this.egnyte.monitorFolder({
      folderPath: this.monitoredFolderPath,
    });
    const newFiles = files.filter((file) => new Date(file.modified).getTime() > lastTimestamp);
    const sortedNewFiles = newFiles.sort((a, b) => new Date(a.modified).getTime() - new Date(b.modified).getTime());

    for (const file of sortedNewFiles) {
      this.$emit(
        file,
        {
          id: file.id,
          summary: `New file: ${file.name}`,
          ts: new Date(file.modified).getTime(),
        },
      );
    }

    if (sortedNewFiles.length > 0) {
      const latestTimestamp = new Date(sortedNewFiles[sortedNewFiles.length - 1].modified).getTime();
      this._setLastTimestamp(latestTimestamp);
    }
  },
};

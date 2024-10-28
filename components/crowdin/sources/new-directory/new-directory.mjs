import { axios } from "@pipedream/platform";
import crowdin from "../../crowdin.app.mjs";

export default {
  key: "crowdin-new-directory",
  name: "New Directory Created",
  description: "Emit new event when a new directory is created. [See the documentation](https://support.crowdin.com/developer/api/v2/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    crowdin,
    db: "$.service.db",
    projectId: {
      propDefinition: [
        crowdin,
        "projectId",
      ],
    },
    directoryId: {
      propDefinition: [
        crowdin,
        "directoryId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 3600,
      },
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    async fetchDirectories() {
      const params = {
        projectId: this.projectId,
      };
      if (this.directoryId) {
        params.directoryId = this.directoryId;
      }
      return this.crowdin.listDirectories(params);
    },
  },
  hooks: {
    async deploy() {
      const directories = await this.fetchDirectories();
      const sortedDirectories = directories.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

      for (const directory of sortedDirectories.slice(0, 50)) {
        const timestamp = Date.parse(directory.createdAt);
        this.$emit(directory, {
          id: directory.id,
          summary: `New Directory: ${directory.name}`,
          ts: timestamp,
        });
        this._setLastTimestamp(timestamp);
      }
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const directories = await this.fetchDirectories();

    for (const directory of directories) {
      const currentTimestamp = Date.parse(directory.createdAt);
      if (currentTimestamp > lastTimestamp) {
        this.$emit(directory, {
          id: directory.id,
          summary: `New Directory: ${directory.name}`,
          ts: currentTimestamp,
        });
        this._setLastTimestamp(currentTimestamp);
      }
    }
  },
};

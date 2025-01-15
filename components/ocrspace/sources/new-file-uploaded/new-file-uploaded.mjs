import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import ocrspace from "../../ocrspace.app.mjs";

export default {
  key: "ocrspace-new-file-uploaded",
  name: "New OCR File Uploaded",
  description: "Emit a new event when a new file is uploaded for OCR processing. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ocrspace,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    monitoredFolder: {
      type: "string",
      label: "Monitored Folder",
      description: "Optional folder to monitor for new file uploads.",
      optional: true,
    },
    processingQueue: {
      type: "string",
      label: "Processing Queue",
      description: "Optional processing queue to monitor for new file uploads.",
      optional: true,
    },
  },
  methods: {
    async fetchUploadedFiles() {
      const params = {};
      if (this.monitoredFolder) {
        params.folder = this.monitoredFolder;
      }
      if (this.processingQueue) {
        params.queue = this.processingQueue;
      }
      const uploadedFiles = await this.ocrspace._makeRequest({
        path: "/list/uploads",
        method: "GET",
        params,
      });
      return uploadedFiles;
    },
  },
  hooks: {
    async deploy() {
      const files = await this.fetchUploadedFiles();
      // Sort files by timestamp descending
      files.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const recentFiles = files.slice(0, 50).reverse();
      for (const file of recentFiles) {
        const id = file.id || new Date(file.timestamp).getTime();
        const summary = `New file uploaded: ${file.name}`;
        const ts = file.timestamp
          ? new Date(file.timestamp).getTime()
          : Date.now();
        this.$emit(file, {
          id,
          summary,
          ts,
        });
      }
      if (files.length > 0) {
        const latestFile = files[0];
        const lastFileId = latestFile.id || new Date(latestFile.timestamp).getTime();
        await this.db.set("lastFileId", lastFileId);
      }
    },
    async activate() {
      // No action needed on activate
    },
    async deactivate() {
      // No action needed on deactivate
    },
  },
  async run() {
    const files = await this.fetchUploadedFiles();
    const lastFileId = (await this.db.get("lastFileId")) || 0;
    const newFiles = files.filter(
      (file) =>
        (file.id && file.id > lastFileId) ||
        (file.timestamp && new Date(file.timestamp).getTime() > lastFileId),
    );
    // Sort newFiles by timestamp ascending
    newFiles.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    for (const file of newFiles) {
      const id = file.id || new Date(file.timestamp).getTime();
      const summary = `New file uploaded: ${file.name}`;
      const ts = file.timestamp
        ? new Date(file.timestamp).getTime()
        : Date.now();
      this.$emit(file, {
        id,
        summary,
        ts,
      });
    }
    if (files.length > 0) {
      const latestFile = files[0];
      const lastFileId = latestFile.id || new Date(latestFile.timestamp).getTime();
      await this.db.set("lastFileId", lastFileId);
    }
  },
};

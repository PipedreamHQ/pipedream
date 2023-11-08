import openai from "../../openai.app.mjs";

export default {
  key: "openai-new-file",
  name: "New File",
  description: "Emit new event when a new file is created in OpenAI. [See the documentation](https://docs.openai.com/api-reference/files)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    openai,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    purpose: {
      propDefinition: [
        openai,
        "purpose",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastFileId() {
      return this.db.get("lastFileId") || null;
    },
    _setLastFileId(id) {
      this.db.set("lastFileId", id);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 files (or less if there aren't 50) to backfill on the first run
      const files = await this.openai.listFiles({
        purpose: this.purpose,
      });
      const lastFiles = files.slice(-50);
      for (const file of lastFiles) {
        this.$emit(file, {
          id: file.id,
          summary: `New File: ${file.filename}`,
          ts: file.created_at * 1000,
        });
      }
      if (lastFiles.length > 0) {
        this._setLastFileId(lastFiles[lastFiles.length - 1].id);
      }
    },
  },
  async run() {
    const lastFileId = this._getLastFileId();
    let reachedLastFile = false;

    let next = undefined;
    do {
      const files = await this.openai.listFiles({
        purpose: this.purpose,
        after: next,
      });

      if (!files || files.length === 0) {
        console.log("No new files found");
        return;
      }

      for (const file of files.reverse()) {
        if (file.id === lastFileId) {
          reachedLastFile = true;
          break;
        }
        this.$emit(file, {
          id: file.id,
          summary: `New File: ${file.filename}`,
          ts: file.created_at * 1000,
        });
      }

      if (files.has_more && !reachedLastFile) {
        next = files.next;
      }
    } while (next && !reachedLastFile);

    // if (!reachedLastFile && files.length > 0) {
    //   this._setLastFileId(files[0].id);
    // }
  },
};

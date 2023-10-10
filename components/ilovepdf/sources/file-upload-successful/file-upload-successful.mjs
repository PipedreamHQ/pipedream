import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import ilovepdf from "../../ilovepdf.app.mjs";

export default {
  key: "ilovepdf-file-upload-successful",
  name: "File Upload Successful",
  description: "Emits an event when a file has been successfully uploaded to ilovepdf.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ilovepdf,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    task: {
      propDefinition: [
        ilovepdf,
        "task",
      ],
    },
    file: {
      propDefinition: [
        ilovepdf,
        "file",
      ],
    },
    tool: {
      propDefinition: [
        ilovepdf,
        "tool",
      ],
    },
    serverFilename: {
      propDefinition: [
        ilovepdf,
        "serverFilename",
      ],
    },
  },
  methods: {
    _getLastUploadDate() {
      return this.db.get("lastUploadDate");
    },
    _setLastUploadDate(lastUploadDate) {
      this.db.set("lastUploadDate", lastUploadDate);
    },
  },
  async run() {
    let lastUploadDate = this._getLastUploadDate();
    const {
      task, file, tool, serverFilename,
    } = this;

    const uploadedFile = await this.ilovepdf.uploadFile({
      task,
      file,
    });

    if (!lastUploadDate) {
      this._setLastUploadDate(uploadedFile.created);
      return;
    }

    if (new Date(uploadedFile.created) > new Date(lastUploadDate)) {
      this.$emit(uploadedFile, {
        id: uploadedFile.server_filename,
        summary: `New file uploaded: ${uploadedFile.server_filename}`,
        ts: Date.parse(uploadedFile.created),
      });
      this._setLastUploadDate(uploadedFile.created);
    }
  },
};

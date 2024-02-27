import castmagic from "../../castmagic.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "castmagic-import-recording-file",
  name: "Import Recording File",
  description: "Imports a specific recording file into Castmagic",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    castmagic,
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "URL of the recording file to be imported",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Custom name for the file once it's imported",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.castmagic.importRecordingFile({
      fileUrl: this.fileUrl,
      fileName: this.fileName,
    });
    $.export("$summary", "Successfully imported recording file");
    return response;
  },
};

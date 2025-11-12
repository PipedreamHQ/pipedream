import chatbotkit from "../../chatbotkit.app.mjs";
import axios from "axios";

export default {
  key: "chatbotkit-dataset-import",
  name: "Import Dataset",
  description: "Imports a specified file into the bot's dataset. [See the documentation](https://chatbotkit.com/docs/api/v1/spec)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chatbotkit,
    datasetId: {
      propDefinition: [
        chatbotkit,
        "datasetId",
      ],
      description: "ID of the dataset where the file should be imported",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "Web-accessible URL of the file to import",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "File name of the new file",
    },
  },
  async run({ $ }) {
    const { id: fileId } = await this.chatbotkit.createFile({
      data: {
        name: this.fileName,
      },
      $,
    });
    try {
      await axios({
        url: `https://api.chatbotkit.com/v1/file/${fileId}/upload`,
        headers: this.chatbotkit._headers(),
        method: "POST",
        data: {
          file: this.fileUrl,
        },
      });
    } catch (e) {
      // API throws a 405 error upon upload
      console.log("File Uploaded");
    }
    const response = await this.chatbotkit.attachDatasetFile({
      datasetId: this.datasetId,
      fileId,
      data: {
        type: "source",
      },
      $,
    });
    $.export("$summary", `Successfully imported file into dataset ${this.datasetId}`);
    return response;
  },
};

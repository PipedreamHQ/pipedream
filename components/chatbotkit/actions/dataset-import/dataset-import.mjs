import chatbotkit from "../../chatbotkit.app.mjs";

export default {
  key: "chatbotkit-dataset-import",
  name: "Import Dataset",
  description: "Imports a specified file into the bot's dataset",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatbotkit,
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "Web-accessible URL to the file to import",
    },
    datasetName: {
      type: "string",
      label: "Dataset Name",
      description: "Name of the dataset where the file should be imported",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chatbotkit.importFile(this.fileUrl, this.datasetName);
    $.export("$summary", `Successfully imported file into dataset ${this.datasetName}`);
    return response;
  },
};

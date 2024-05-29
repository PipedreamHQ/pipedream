import albus from "../../albus.app.mjs";

export default {
  key: "albus-train-file",
  name: "Train File",
  description: "Trains a file using Albus's proprietary algorithms.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    albus,
    file: {
      type: "string",
      label: "File",
      description: "The file to be trained",
    },
    settings: {
      type: "object",
      label: "Training Settings",
      description: "Specify the training settings",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.albus.trainFile({
      file: this.file,
      settings: this.settings,
    });
    $.export("$summary", `Successfully trained file ${this.file}`);
    return response;
  },
};

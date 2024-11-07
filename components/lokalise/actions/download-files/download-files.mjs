import lokalise from "../../lokalise.app.mjs";

export default {
  key: "lokalise-download-files",
  name: "Download Files",
  description: "Retrieves and downloads files from a specified Lokalise project.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lokalise,
    projectId: {
      propDefinition: [
        lokalise,
        "projectId",
      ],
    },
    fileFormat: {
      propDefinition: [
        lokalise,
        "fileFormat",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.lokalise.downloadFiles({
      data: {
        format: this.fileFormat,
      },
    });
    $.export("$summary", `Successfully downloaded files from project ${this.projectId}`);
    return response;
  },
};

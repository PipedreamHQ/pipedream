import lokalise from "../../lokalise.app.mjs";

export default {
  key: "lokalise-download-files",
  name: "Download Files",
  description: "Retrieves and downloads files from a specified Lokalise project. [See the documentation](https://developers.lokalise.com/reference/download-files)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      type: "string",
      label: "File Format",
      description: "File format (e.g. json, strings, xml). Must be file extension of any of the [supported file formats](https://docs.lokalise.com/en/collections/2909229-supported-file-formats). May also be `ios_sdk` or `android_sdk` for respective OTA SDK bundles.",
    },
  },
  async run({ $ }) {
    const response = await this.lokalise.downloadFiles({
      $,
      projectId: this.projectId,
      data: {
        format: this.fileFormat,
      },
    });

    $.export("$summary", `Successfully downloaded files from project ${this.projectId}`);
    return response;
  },
};

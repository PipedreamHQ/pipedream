import wistia from "../../wistia.app.mjs";

export default {
  name: "Upload Media",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "wistia-upload-media",
  description: "Upload a media. [See docs here](https://wistia.com/support/developers/upload-api)",
  type: "action",
  props: {
    wistia,
    name: {
      label: "Name",
      description: "The name of the media",
      type: "string",
    },
    projectId: {
      propDefinition: [
        wistia,
        "projectId",
      ],
    },
    fileUrl: {
      label: "File URL",
      description: "The URL of the file to upload",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.wistia.uploadMedia({
      $,
      data: {
        project_id: this.projectId,
        name: this.name,
        url: this.fileUrl,
      },
    });

    $.export("$summary", `Successfully upload media with id ${response.id}`);

    return response;
  },
};

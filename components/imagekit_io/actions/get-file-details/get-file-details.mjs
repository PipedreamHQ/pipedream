import imagekitIo from "../../imagekit_io.app.mjs";

export default {
  key: "imagekit_io-get-file-details",
  name: "Get File Details",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get details from a specific file. [See the documentation](https://docs.imagekit.io/api-reference/media-api/get-file-details)",
  type: "action",
  props: {
    imagekitIo,
    fileId: {
      propDefinition: [
        imagekitIo,
        "fileId",
      ],
    },
  },
  async run({ $ }) {
    const {
      imagekitIo,
      fileId,
    } = this;

    const response = await imagekitIo.getFile({
      $,
      fileId,
    });

    $.export("$summary", `The details of the file with Id: ${fileId} was successfully fetched!`);
    return response;
  },
};

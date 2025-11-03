import app from "../../document360.app.mjs";

export default {
  key: "document360-get-file-information",
  name: "Get File Information",
  description: "Gets file information from Document360 Drive. [See the documentation](https://apidocs.document360.com/apidocs/gets-file-information)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "folderId",
      ],
    },
    fileId: {
      propDefinition: [
        app,
        "fileId",
        ({ folderId }) => ({
          folderId,
        }),
      ],
    },
    appendSASToken: {
      type: "boolean",
      label: "Append SAS Token",
      description: "Set this to false to exclude appending SAS token for images/files",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      folderId,
      fileId,
      appendSASToken,
    } = this;

    const response = await app.getFileInformation({
      $,
      folderId,
      fileId,
      params: {
        appendSASToken,
      },
    });

    $.export("$summary", `Successfully retrieved file information for file ID \`${fileId}\``);
    return response;
  },
};

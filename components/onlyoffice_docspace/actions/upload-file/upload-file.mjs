import app from "../../onlyoffice_docspace.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "onlyoffice_docspace-upload-file",
  name: "Upload File",
  description: "Uploads a file to the specified room. [See the documentation](https://api.onlyoffice.com/docspace/method/files/post/api/2.0/files/%7bfolderid%7d/upload)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    folderId: {
      label: "Folder ID",
      description: "The ID of the folder where you want the file to be uploaded.",
      propDefinition: [
        app,
        "file",
      ],
    },
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    uploadFile({
      folderId, ...args
    } = {}) {
      return this.app.post({
        path: `/files/${folderId}/upload`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadFile,
      folderId,
      file,
    } = this;

    const response = await uploadFile({
      $,
      folderId,
      headers: constants.MULTIPART_FORM_DATA_HEADERS,
      data: {
        File: file,
      },
    });

    $.export("$summary", `Successfully uploaded file with ID \`${response.response.id}\`.`);
    return response;
  },
};

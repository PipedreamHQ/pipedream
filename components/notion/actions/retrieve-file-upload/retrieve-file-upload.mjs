import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-retrieve-file-upload",
  name: "Retrieve File Upload",
  description: "Use this action to retrieve a file upload. [See the documentation](https://developers.notion.com/reference/retrieve-a-file-upload)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    fileUploadId: {
      propDefinition: [
        notion,
        "fileUploadId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notion.retrieveFileUpload({
      file_upload_id: this.fileUploadId,
    });

    $.export("$summary", `Successfully retrieved file upload with ID ${this.fileUploadId}`);
    return response;
  },
};

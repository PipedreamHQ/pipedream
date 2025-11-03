import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-complete-file-upload",
  name: "Complete File Upload",
  description: "Use this action to finalize a `mode=multi_part` file upload after all of the parts have been sent successfully. [See the documentation](https://developers.notion.com/reference/complete-a-file-upload)",
  version: "0.0.8",
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
        () => ({
          status: "pending",
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notion.completeFileUpload({
      file_upload_id: this.fileUploadId,
    });

    $.export("$summary", `Successfully completed file upload with ID ${this.fileUploadId}`);
    return response;
  },
};

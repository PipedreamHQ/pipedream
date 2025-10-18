import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-create-file-upload",
  name: "Create File Upload",
  description: "Create a file upload. [See the documentation](https://developers.notion.com/reference/create-a-file-upload)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    mode: {
      type: "string",
      label: "Mode",
      description: "How the file is being sent. Use `Multi Part` for files larger than 20MB. Use `External URL` for files that are temporarily hosted publicly elsewhere.",
      options: [
        {
          label: "Single Part",
          value: "single_part",
        },
        {
          label: "Multi Part",
          value: "multi_part",
        },
        {
          label: "External URL",
          value: "external_url",
        },
      ],
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Name of the file to be created. Required when mode is multi_part or external_url. Otherwise optional, and used to override the filename. Must include an extension.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "MIME type of the file to be created. Recommended when sending the file in multiple parts. Must match the content type of the file that's sent, and the extension of the `filename` parameter if any.",
      optional: true,
    },
    numberOfParts: {
      type: "integer",
      label: "Number of Parts",
      description: "When mode is `Multi Part`, the number of parts you are uploading. Must be between 1 and 1,000. This must match the number of parts as well as the final part_number you send.",
      optional: true,
    },
    externalUrl: {
      type: "string",
      label: "External URL",
      description: "When mode is `External URL`, provide the HTTPS URL of a publicly accessible file to import into your workspace.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.notion.createFileUpload({
      mode: this.mode,
      filename: this.filename,
      content_type: this.contentType,
      number_of_parts: this.numberOfParts,
      external_url: this.externalUrl,
    });

    $.export("$summary", `Successfully created file upload with ID ${response.id}`);
    return response;
  },
};

import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import { CONTENT_TYPE_OPTIONS } from "../../common/constants.mjs";
import { checkTmp } from "../../common/utils.mjs";
import greenhouse from "../../greenhouse.app.mjs";

export default {
  key: "greenhouse-add-attachment-to-candidate",
  name: "Add Attachment to Candidate",
  description: "Adds an attachment to a specific candidate or prospect. [See the documentation](https://developers.greenhouse.io/harvest.html#post-add-attachment)",
  version: "0.0.1",
  type: "action",
  props: {
    greenhouse,
    userId: {
      propDefinition: [
        greenhouse,
        "userId",
      ],
    },
    candidateId: {
      propDefinition: [
        greenhouse,
        "candidateId",
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Name of the file.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the file.",
      options: [
        "resume",
        "cover_letter",
        "admin_only",
      ],
    },
    file: {
      type: "string",
      label: "File",
      description: "The path to the image file saved to the `/tmp` directory (e.g. `/tmp/example.jpg`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory). (if you are providing content, you do not need to provide url).",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "Url of the attachment (if you are providing the url, you do not need to provide the content.) *Please note, shareable links from cloud services such as Google Drive will result in a corrupted file. Please use machine accessbile URLs*.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The content-type of the document you are sending. When using a URL, this generally isn't needed, as the responding server will deliver a content type. This should be included for encoded content.",
      optional: true,
      options: CONTENT_TYPE_OPTIONS,
    },
  },
  async run({ $ }) {
    if ((this.file && this.url) || (!this.file && !this.url)) {
      throw new ConfigurationError("You must provide either File or URL");
    }

    let encodedFile;

    if (this.file) {
      if (!this.contentType) {
        throw new ConfigurationError("You must provide the Content-Type");
      }
      const file = fs.readFileSync(checkTmp(this.file));
      encodedFile = Buffer(file).toString("base64");
    }

    const response = await this.greenhouse.addAttachmentToCandidate({
      $,
      headers: {
        "On-Behalf-Of": this.userId,
      },
      candidateId: this.candidateId,
      data: {
        filename: this.filename,
        type: this.type,
        content: encodedFile,
        url: this.url,
        content_type: this.contentType,
      },
    });

    $.export("$summary", `Successfully added attachment to candidate ${this.candidateId}`);
    return response;
  },
};

import {
  ConfigurationError, getFileStream,
} from "@pipedream/platform";
import { CONTENT_TYPE_OPTIONS } from "../../common/constants.mjs";
import greenhouse from "../../greenhouse.app.mjs";

export default {
  key: "greenhouse-add-attachment-to-candidate",
  name: "Add Attachment to Candidate",
  description: "Adds an attachment to a specific candidate or prospect. [See the documentation](https://developers.greenhouse.io/harvest.html#post-add-attachment)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File or URL",
      description: "Provide a file URL or path to a file in the `/tmp` directory.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The content-type of the document you are sending. This should be included for encoded content.",
      optional: true,
      options: CONTENT_TYPE_OPTIONS,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    if (!this.file) {
      throw new ConfigurationError("You must provide a File or URL.");
    }

    if (!this.contentType) {
      throw new ConfigurationError("You must provide the Content-Type.");
    }

    const stream = await getFileStream(this.file);
    const encodedFile = await this.streamToBase64(stream);

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
        content_type: this.contentType,
      },
    });

    $.export("$summary", `Successfully added attachment to candidate ${this.candidateId}`);
    return response;
  },
};

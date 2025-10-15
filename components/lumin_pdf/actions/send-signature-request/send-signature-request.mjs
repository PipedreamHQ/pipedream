import {
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import { parseObject } from "../../common/utils.mjs";
import luminPdf from "../../lumin_pdf.app.mjs";

export default {
  key: "lumin_pdf-send-signature-request",
  name: "Send Signature Request",
  description: "Send a signature request to signers. [See the documentation](https://developers.luminpdf.com/api/send-signature-request/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    luminPdf,
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of a single file to be downloaded and signed. This field is mutually exclusive with `file`, `files`, and `File URLs`. Only one of these fields should be provided in the request.",
      optional: true,
    },
    file: {
      type: "string",
      label: "File",
      description: "A single path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`) to be sent for signature. This field is mutually exclusive with `File URL`, `Files`, and `File URLs`. Only one of these fields should be provided in the request.",
      optional: true,
    },
    fileUrls: {
      type: "string[]",
      label: "File URLs",
      description: "An array of URLs of files to be downloaded and signed. This field is mutually exclusive with `File`, `Files`, and `File URL`. Only one of these fields should be provided in the request.",
      optional: true,
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "An array of path to files in the `/tmp` directory (for example, `/tmp/myFile.pdf`) to be sent for signature. This field is mutually exclusive with `File URL`, `Files`, and `File URLs`. Only one of these fields should be provided in the request.",
      optional: true,
    },
    signers: {
      type: "string[]",
      label: "Signers",
      description: "A list of objects of signers to add to your Signature Request. Format: `[{'email_address': 'email@example.com', 'name': 'John Doe', 'group': 1}, {'email_address': 'email2@example.com', 'name': 'Jane Doe', 'group': 2}]`. [See the documentation](https://developers.luminpdf.com/api/send-signature-request/) for more information.",
      optional: true,
    },
    viewers: {
      type: "string[]",
      label: "Viewers",
      description: "A list of objects of viewers to add to your Signature Request. Format: `[{'email_address': 'email@example.com', 'name': 'John Doe'}, {'email_address': 'email2@example.com', 'name': 'Jane Doe'}]`. [See the documentation](https://developers.luminpdf.com/api/send-signature-request/) for more information.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title you want to give the Signature Request.",
    },
    expiresAt: {
      type: "string",
      label: "Expires At",
      description: "When the Signature Request will expire. Should be later than today. In ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).",
    },
    useTextTags: {
      type: "boolean",
      label: "Use Text Tags",
      description: "Set to `true` to enable Text Tag parsing in your document. Your Text Tags will be converted into UI components for the user to interact with.",
      optional: true,
    },
    signingType: {
      type: "string",
      label: "Signing Type",
      description: "The signing order for the Signature Request.",
      options: [
        "SAME_TIME",
        "ORDER",
      ],
      optional: true,
    },
    senderEmail: {
      type: "string",
      label: "Sender Email",
      description: "The email address of the sender.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email.",
      optional: true,
    },
    customEmailTitle: {
      type: "string",
      label: "Custom Email Title",
      description: "The title of the email.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    async appendFile(formData, fieldName, file) {
      const {
        stream,
        metadata,
      } = await getFileStreamAndMetadata(file);
      formData.append(fieldName, stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    const checkFiles = {};
    if (this.file) checkFiles.file = this.file;
    if (this.files) checkFiles.files = this.files;
    if (this.fileUrl) checkFiles.fileUrl = this.fileUrl;
    if (this.fileUrls) checkFiles.fileUrls = this.fileUrls;

    if (Object.keys(checkFiles).length > 1) {
      throw new ConfigurationError("Only one of `File URL`, `File`, `File URLs`, or `Files` should be provided in the request.");
    }
    if (Object.keys(checkFiles).length === 0) {
      throw new ConfigurationError("At least one of `File URL`, `File`, `File URLs`, or `Files` should be provided in the request.");
    }

    if (this.file) {
      await this.appendFile(formData, "file", this.file);
    }
    if (this.files) {
      for (const [
        index,
        file,
      ] of this.files.entries()) {
        await this.appendFile(formData, `files[${index}]`, file);
      }
    }
    if (this.fileUrl) {
      formData.append("file_url", this.fileUrl);
    }
    if (this.fileUrls) {
      for (const [
        index,
        fileUrl,
      ] of this.fileUrls.entries()) {
        formData.append(`file_urls[${index}]`, fileUrl);
      }
    }
    if (this.signers) {
      for (const [
        index,
        signer,
      ] of parseObject(this.signers).entries()) {
        for (const item of Object.keys(signer)) {
          formData.append(`signers[${index}][${item}]`, signer[item]);
        }
      }
    }
    if (this.viewers) {
      for (const [
        index,
        viewer,
      ] of parseObject(this.viewers).entries()) {
        for (const item of Object.keys(viewer)) {
          formData.append(`viewers[${index}][${item}]`, viewer[item]);
        }
      }
    }
    if (this.title) formData.append("title", this.title);
    if (this.expiresAt) formData.append("expires_at", Date.parse(this.expiresAt));
    if (this.useTextTags) formData.append("use_text_tags", `${this.useTextTags}`);
    if (this.signingType) formData.append("signing_type", this.signingType);
    if (this.senderEmail) formData.append("custom_email[sender_email]", this.senderEmail);
    if (this.senderEmail) formData.append("custom_email[subject_name]", this.subject);
    if (this.senderEmail) formData.append("custom_email[title]", this.customEmailTitle);

    const response = await this.luminPdf.sendSignatureRequest({
      $,
      headers: formData.getHeaders(),
      data: formData,
    });

    if (response) {
      $.export("$summary", `Successfully sent signature request ${response.signature_request.signature_request_id}`);
    }

    return response;
  },
};

import base from "../common/base.mjs";
import {
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";

export default {
  key: "amazon_ses-send-email",
  name: "Send Email",
  description: "Send an email using Amazon SES. Supports simple email messaging. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sesv2/classes/sendemailcommand.html)",
  version: "0.9.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...base.props,
    ToAddresses: {
      propDefinition: [
        base.props.amazonSes,
        "ToAddresses",
      ],
    },
    CcAddresses: {
      propDefinition: [
        base.props.amazonSes,
        "CcAddresses",
      ],
    },
    BccAddresses: {
      propDefinition: [
        base.props.amazonSes,
        "BccAddresses",
      ],
    },
    ReplyToAddresses: {
      propDefinition: [
        base.props.amazonSes,
        "ReplyToAddresses",
      ],
    },
    Subject: {
      propDefinition: [
        base.props.amazonSes,
        "Subject",
      ],
    },
    Text: {
      propDefinition: [
        base.props.amazonSes,
        "Text",
      ],
      default: "",
    },
    Html: {
      propDefinition: [
        base.props.amazonSes,
        "Html",
      ],
      optional: true,
    },
    FromEmailAddress: {
      propDefinition: [
        base.props.amazonSes,
        "FromEmailAddress",
      ],
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "File paths (e.g., `/tmp/file.pdf`) or URLs to attach to the email. Files will be automatically base64-encoded and MIME types auto-detected.",
      optional: true,
    },
    inlineAttachments: {
      type: "object",
      label: "Inline Attachments",
      description: "Object mapping Content IDs to file paths/URLs for inline images in HTML emails. Example: `{\"logo\": \"/tmp/logo.png\"}`. Reference in HTML as `<img src=\"cid:logo\">`",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  methods: {
    async createAttachmentFromFile(filePath) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(filePath);

      // Drain stream into buffer
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const binaryContent = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

      // Derive filename from metadata or path
      const filename = metadata.name || filePath.split("/").pop()
        .split("?")[0];

      // Build base attachment object
      const attachment = {
        RawContent: binaryContent,
        FileName: filename,
        ContentTransferEncoding: "BASE64",
      };

      // Add content type if detected
      if (metadata.contentType) {
        attachment.ContentType = metadata.contentType;
      }

      return attachment;
    },
    async processAttachments({
      attachments = [], inlineAttachments = {},
    }) {
      const result = [];

      // Process regular attachments
      for (const filePath of attachments) {
        const attachment = await this.createAttachmentFromFile(filePath);
        result.push(attachment);
      }

      // Process inline attachments
      for (const [
        contentId,
        filePath,
      ] of Object.entries(inlineAttachments)) {
        const attachment = await this.createAttachmentFromFile(filePath);
        attachment.ContentId = contentId;
        attachment.ContentDisposition = "INLINE";
        result.push(attachment);
      }

      return result;
    },
  },
  async run({ $ }) {
    if (!(this.Text || this.Html)) {
      throw new ConfigurationError("Email Text or HTML must be supplied");
    }

    const params = {
      Content: {
        Simple: {
          Subject: this.amazonSes.createCharsetContent(this.Subject),
          Body: {
            Text: this.amazonSes.createCharsetContent(this.Text),
          },
        },
      },
      Destination: {
        ToAddresses: this.ToAddresses,
        CcAddresses: this.CcAddresses,
        BccAddresses: this.BccAddresses,
      },
      FromEmailAddress: this.FromEmailAddress,
      ReplyToAddresses: this.ReplyToAddresses,
    };

    if (this.Html) {
      params.Content.Simple.Body.Html = this.amazonSes.createCharsetContent(this.Html);
    }

    // Add attachments if provided
    if (this.attachments?.length || Object.keys(this.inlineAttachments || {}).length) {
      const processedAttachments = await this.processAttachments({
        attachments: this.attachments || [],
        inlineAttachments: this.inlineAttachments || {},
      });

      if (processedAttachments.length > 0) {
        params.Content.Simple.Attachments = processedAttachments;
      }
    }

    const response = await this.amazonSes.sendEmail(this.region, params);
    $.export("$summary", "Sent email successfully");
    return response;
  },
};

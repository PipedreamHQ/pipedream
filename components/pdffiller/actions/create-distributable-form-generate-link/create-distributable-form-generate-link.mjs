import {
  ACCESS_OPTIONS, STATUS_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import pdffiller from "../../pdffiller.app.mjs";

export default {
  key: "pdffiller-create-distributable-form-generate-link",
  name: "Create Distributable Form and Generate Link",
  description: "Transforms a document into a fillable form and generates a shareable link for the form. [See the documentation](https://docs.pdffiller.com/docs/pdffiller/9d3a06696db96-create-fillable-document-converts-a-downloaded-document-to-a-link-to-fill-form)",
  version: "0.0.2",
  type: "action",
  props: {
    pdffiller,
    documentId: {
      propDefinition: [
        pdffiller,
        "documentId",
      ],
    },
    access: {
      type: "string",
      label: "Access",
      description: "Access level for the fill request document.",
      options: ACCESS_OPTIONS,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Document access permission.",
      options: STATUS_OPTIONS,
    },
    nameRequired: {
      type: "boolean",
      label: "Name Required",
      description: "Name required",
      default: false,
    },
    emailRequired: {
      type: "boolean",
      label: "Email Required",
      description: "Email required",
      default: false,
    },
    enforceRequiredFields: {
      type: "boolean",
      label: "Enforce Required Fields",
      description: "Prevent closing document before filling all fields.",
      default: false,
    },
    allowDownloads: {
      type: "boolean",
      label: "Allow Downloads",
      description: "Allow to download",
      default: false,
    },
    redirectUrl: {
      type: "string",
      label: "Redirect URL",
      description: "Redirect to URL after complete.",
      optional: true,
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "LinkToFill custom message.",
      optional: true,
    },
    notificationEmails: {
      type: "string[]",
      label: "Notification Emails",
      description: "LinkToFill notification emails.",
      optional: true,
    },
    additionalDocuments: {
      type: "string[]",
      label: "Additional Documents",
      description: "Additional documents required after filling the document. Max count 5.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pdffiller.createFillableDocument({
      $,
      data: {
        document_id: this.documentId,
        access: this.access,
        status: this.status,
        name_required: this.nameRequired,
        email_required: this.emailRequired,
        enforce_required_fields: this.enforceRequiredFields,
        allow_downloads: this.allowDownloads,
        redirect_url: this.redirectUrl,
        notification_emails: parseObject(this.notificationEmails)?.map((email) => ({
          email,
        })),
        additional_documents: this.additionalDocuments,
        custom_message: this.customMessage,
      },
    });

    $.export("$summary", `Successfully created a fillable form and generated a shareable link for document ID ${this.fillableFormId}`);
    return response;
  },
};

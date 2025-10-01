import constants from "../../common/constants.mjs";
import app from "../../holded.app.mjs";

export default {
  key: "holded-send-email",
  name: "Send Email",
  description: "Deliver an email with a document to a contact through Holded. [See the docs](https://developers.holded.com/reference/send-document-1).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    docType: {
      type: "string",
      label: "Document Type",
      description: "The type of document to send.",
      options: Object.values(constants.DOC_TYPE),
    },
    documentId: {
      propDefinition: [
        app,
        "documentId",
        ({ docType }) => ({
          args: {
            docType,
          },
        }),
      ],
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The emails to send the document to.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email. Minimum 10 characters.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message of the email. Minimum 20 characters.",
      optional: true,
    },
  },
  methods: {
    sendDocument({
      docType, documentId, ...args
    } = {}) {
      return this.app.post({
        path: `/documents/${docType}/${documentId}/send`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      docType,
      documentId,
      emails,
      subject,
      message,
    } = this;

    const response = await this.sendDocument({
      step,
      docType,
      documentId,
      data: {
        emails: Array.isArray(emails)
          ? emails.toString()
          : emails,
        subject,
        message,
      },
    });

    step.export("$summary", `Successfully sent document with status \`${response.info}\``);

    return response;
  },
};

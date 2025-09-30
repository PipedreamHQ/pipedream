import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import boldsign from "../../boldsign.app.mjs";
import { DOCUMENT_DOWNLOAD_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "boldsign-send-document-template",
  name: "Send Document Using Template",
  description: "Send documents for e-signature using a BoldSign template. [See the documentation](https://developers.boldsign.com/documents/send-document-from-template/?region=us)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    boldsign,
    templateId: {
      propDefinition: [
        boldsign,
        "templateId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the document.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "A message to include with the document.",
      optional: true,
    },
    roles: {
      type: "string[]",
      label: "Roles",
      description: "A role is simply a placeholder for a real person. For example, if we have a purchase order that will always be signed by two people, one from the company and one from the customer, we can create a template with two roles Customer and Representative. Example: **[{\"roleIndex\": 50,\"signerName\": \"Richard\",\"signerOrder\": 1,\"signerEmail\": \"richard@cubeflakes.com\",\"privateMessage\": \"Please check and sign the document.\",\"authenticationCode\": \"281028\",\"enableEmailOTP\": false,\"signerType\": \"Signer\",\"signerRole\": \"Manager\",\"formFields\": [{\"id\": \"SignField\",\"fieldType\": \"Signature\",\"pageNumber\": 1,\"bounds\": {\"x\": 100,\"y\": 100,\"width\": 100,\"height\": 50},\"isRequired\": true}]**.",
    },
    brandId: {
      propDefinition: [
        boldsign,
        "brandId",
      ],
      optional: true,
    },
    labels: {
      propDefinition: [
        boldsign,
        "labels",
      ],
      optional: true,
    },
    disableEmails: {
      type: "boolean",
      label: "Disable Emails",
      description: "Disable sending emails to recipients.",
      optional: true,
    },
    disableSMS: {
      type: "boolean",
      label: "Disable SMS",
      description: "Disable sending SMS to recipients.",
      optional: true,
    },
    hideDocumentId: {
      type: "boolean",
      label: "Hide Document ID",
      description: "Decides whether the document ID should be hidden or not.",
      optional: true,
    },
    enableAutoReminder: {
      type: "boolean",
      label: "Enable Auto Reminder",
      description: "Enable automatic reminders.",
      reloadProps: true,
      optional: true,
    },
    reminderDays: {
      type: "integer",
      label: "Reminder Days",
      description: "Number of days between reminders.",
      hidden: true,
      optional: true,
    },
    reminderCount: {
      type: "integer",
      label: "Reminder Count",
      description: "Number of reminder attempts.",
      hidden: true,
      optional: true,
    },
    cc: {
      propDefinition: [
        boldsign,
        "cc",
      ],
      optional: true,
    },
    expiryDays: {
      type: "integer",
      label: "Expiry Days",
      description: "Number of days before document expires.",
      optional: true,
    },
    enablePrintAndSign: {
      type: "boolean",
      label: "Enable Print and Sign",
      description: "Allow signers to print and sign document.",
      optional: true,
    },
    enableReassign: {
      type: "boolean",
      label: "Enable Reassign",
      description: "Allow signers to reassign the document.",
      optional: true,
    },
    enableSigningOrder: {
      type: "boolean",
      label: "Enable Signing Order",
      description: "Enable signing order for the document.",
      optional: true,
    },
    disableExpiryAlert: {
      type: "boolean",
      label: "Disable Expiry Alert",
      description: "Disable alerts before document expiry.",
      optional: true,
    },
    documentInfo: {
      type: "string[]",
      label: "Document Info",
      description: "Custom information fields for the document. [See the documentation](https://developers.boldsign.com/documents/send-document-from-template) for further information.",
      optional: true,
    },
    roleRemovalIndices: {
      type: "integer[]",
      label: "Role Removal Indices",
      description: "Removes the roles present in the template with their indices given in this property.",
      optional: true,
    },
    documentDownloadOption: {
      type: "string",
      label: "Document Download Option",
      description: "Option for document download configuration.",
      options: DOCUMENT_DOWNLOAD_OPTIONS,
      optional: true,
    },
    formGroups: {
      type: "string[]",
      label: "Form Groups",
      description: "Manages the rules and configuration of grouped form fields. [See the documentation](https://developers.boldsign.com/documents/send-document-from-template) for further information.",
      optional: true,
    },
    files: {
      type: "string[]",
      label: "File Paths or URLs",
      description: "The files to upload. For each entry, provide either a file URL or path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
      optional: true,
    },
    fileUrls: {
      type: "string[]",
      label: "File URLs",
      description: "URLs of files to include in the document.",
      optional: true,
    },
    recipientNotificationSettings: {
      type: "object",
      label: "Recipient Notification Settings",
      description: "Settings for recipient notifications. [See the documentation](https://developers.boldsign.com/documents/send-document-from-template) for further information.",
      optional: true,
    },
    removeFormfields: {
      type: "string[]",
      label: "Remove Formfields",
      description: "The removeFormFields property in API allows you to exclude specific form fields from a document before sending it. You provide a string array with the IDs of the existing form fields you want to remove. One or more values can be specified.",
      optional: true,
    },
    enableAuditTrailLocalization: {
      type: "boolean",
      label: "Enable Audit Trail Localization",
      description: "Enable localization for audit trail based on the signer's language. If null is provided, the value will be inherited from the Business Profile settings. Only one additional language can be specified in the signer's languages besides English.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps(props) {
    props.reminderDays.hidden = !this.enableAutoReminder;
    props.reminderCount.hidden = !this.enableAutoReminder;
    return {};
  },
  async run({ $ }) {
    try {
      const files = [];
      if (this.files) {
        for (const file of parseObject(this.files)) {
          const {
            stream, metadata,
          } = await getFileStreamAndMetadata(file);
          const chunks = [];
          for await (const chunk of stream) {
            chunks.push(chunk);
          }
          const buffer = Buffer.concat(chunks);
          files.push(`data:${metadata.contentType};base64,${buffer.toString("base64")}`);
        }
      }

      const additionalData = {};
      if (this.enableAutoReminder) {
        additionalData.reminderSettings = {
          enableAutoReminder: this.enableAutoReminder,
          reminderDays: this.reminderDays,
          reminderCount: this.reminderCount,
        };
      }

      const response = await this.boldsign.sendDocument({
        $,
        headers: {
          "Content-Type": "application/json;odata.metadata=minimal;odata.streaming=true",
        },
        params: {
          templateId: this.templateId,
        },
        data: {
          title: this.title,
          message: this.message,
          roles: parseObject(this.roles),
          brandId: this.brandId,
          labels: parseObject(this.labels),
          disableEmails: this.disableEmails,
          disableSMS: this.disableSMS,
          hideDocumentId: this.hideDocumentId,
          reminderSettings: {
            enableAutoReminder: this.enableAutoReminder,
            reminderDays: this.reminderDays,
            reminderCount: this.reminderCount,
          },
          cc: parseObject(this.cc)?.map((item) => ({
            emailAddress: item,
          })),
          expiryDays: this.expiryDays,
          enablePrintAndSign: this.enablePrintAndSign,
          enableReassign: this.enableReassign,
          enableSigningOrder: this.enableSigningOrder,
          disableExpiryAlert: this.disableExpiryAlert,
          documentInfo: parseObject(this.documentInfo),
          roleRemovalIndices: parseObject(this.roleRemovalIndices),
          documentDownloadOption: this.documentDownloadOption,
          formGroups: parseObject(this.formGroups),
          files,
          fileUrls: parseObject(this.fileUrls),
          recipientNotificationSettings: parseObject(this.recipientNotificationSettings),
          removeFormfields: parseObject(this.removeFormfields),
          enableAuditTrailLocalization: this.enableAuditTrailLocalization,
          ...additionalData,
        },
      });
      $.export("$summary", `Document sent successfully using template ${this.templateId}`);
      return response;
    } catch ({ message }) {
      const parsedMessage = JSON.parse(message);
      let errorMessage = "";
      if (parsedMessage.error) errorMessage = parsedMessage.error;
      if (parsedMessage.errors) {
        Object.entries(parsedMessage.errors).map(([
          ,
          value,
        ]) => {
          errorMessage += `- ${value[0]}\n`;
        });
      }
      throw new ConfigurationError(errorMessage);
    }
  },
};

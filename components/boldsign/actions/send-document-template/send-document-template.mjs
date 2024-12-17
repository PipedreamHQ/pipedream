import boldsign from "../../boldsign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "boldsign-send-document-template",
  name: "Send Document Using Template",
  description: "Send documents for e-signature using a BoldSign template. [See the documentation](https://developers.boldsign.com/documents/send-document-from-template/?region=us)",
  version: "0.0.{{ts}}",
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
      propDefinition: [
        boldsign,
        "title",
      ],
    },
    message: {
      propDefinition: [
        boldsign,
        "message",
      ],
    },
    roles: {
      propDefinition: [
        boldsign,
        "roles",
      ],
    },
    brandId: {
      propDefinition: [
        boldsign,
        "brandId",
      ],
    },
    labels: {
      propDefinition: [
        boldsign,
        "labels",
      ],
    },
    disableEmails: {
      propDefinition: [
        boldsign,
        "disableEmails",
      ],
    },
    disableSMS: {
      propDefinition: [
        boldsign,
        "disableSMS",
      ],
    },
    hitDocumentId: {
      propDefinition: [
        boldsign,
        "hitDocumentId",
      ],
    },
    enableAutoReminder: {
      propDefinition: [
        boldsign,
        "enableAutoReminder",
      ],
    },
    reminderDays: {
      propDefinition: [
        boldsign,
        "reminderDays",
      ],
    },
    reminderCount: {
      propDefinition: [
        boldsign,
        "reminderCount",
      ],
    },
    cc: {
      propDefinition: [
        boldsign,
        "cc",
      ],
    },
    expiryDays: {
      propDefinition: [
        boldsign,
        "expiryDays",
      ],
    },
    enablePrintAndSign: {
      propDefinition: [
        boldsign,
        "enablePrintAndSign",
      ],
    },
    enableReassign: {
      propDefinition: [
        boldsign,
        "enableReassign",
      ],
    },
    enableSigningOrder: {
      propDefinition: [
        boldsign,
        "enableSigningOrder",
      ],
    },
    disableExpiryAlert: {
      propDefinition: [
        boldsign,
        "disableExpiryAlert",
      ],
    },
    documentInfo: {
      propDefinition: [
        boldsign,
        "documentInfo",
      ],
    },
    onBehalfOf: {
      propDefinition: [
        boldsign,
        "onBehalfOf",
      ],
    },
    roleRemovalIndices: {
      propDefinition: [
        boldsign,
        "roleRemovalIndices",
      ],
    },
    documentDownloadOption: {
      propDefinition: [
        boldsign,
        "documentDownloadOption",
      ],
    },
    formGroups: {
      propDefinition: [
        boldsign,
        "formGroups",
      ],
    },
    files: {
      propDefinition: [
        boldsign,
        "files",
      ],
    },
    fileUrls: {
      propDefinition: [
        boldsign,
        "fileUrls",
      ],
    },
    recipientNotificationSettings: {
      propDefinition: [
        boldsign,
        "recipientNotificationSettings",
      ],
    },
    removeFormfields: {
      propDefinition: [
        boldsign,
        "removeFormfields",
      ],
    },
    enableAuditTrailLocalization: {
      propDefinition: [
        boldsign,
        "enableAuditTrailLocalization",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.boldsign.sendDocument();
    $.export("$summary", `Document sent successfully using template ${this.templateId}`);
    return response;
  },
};

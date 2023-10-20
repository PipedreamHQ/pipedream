import drata from "../../drata.app.mjs";
import { axios } from "@pipedream/platform";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/DevicePublicController_uploadDocumentForDevice/";

export default {
  key: "drata-upload-device-compliance-document",
  name: "Upload Device Compliance Document",
  description: `Upload a device compliance document. [See the documentation](${docsLink}).`,
  version: "0.0.3",
  type: "action",
  props: {
    drata,
    deviceId: {
      propDefinition: [
        drata,
        "deviceId",
      ],
    },
    documentType: {
      type: "string",
      label: "Document Type",
      description: "The user document type",
      options: [
        "PASSWORD_MANAGER_EVIDENCE",
        "AUTO_UPDATES_EVIDENCE",
        "HARD_DRIVE_ENCRYPTION_EVIDENCE",
        "ANTIVIRUS_EVIDENCE",
        "LOCK_SCREEN_EVIDENCE",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the document file.",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename of the document file.",
    },
    extension: {
      type: "string",
      label: "Extension",
      description: "The extension of the document file.",
      withLabel: true,
      options: [
        {
          label: ".pdf",
          value: "application/pdf",
        },
        {
          label: ".doc",
          value: "application/msword",
        },
        {
          label: ".docx",
          value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        {
          label: ".xls",
          value: "application/vnd.ms-excel",
        },
        {
          label: ".xlsx",
          value: "officedocument.spreadsheetml.sheet",
        },
        {
          label: ".png",
          value: "image/png",
        },
        {
          label: ".jpeg",
          value: "image/jpeg",
        },
      ],
    },
  },
  methods: {
    async downloadFile({ $ }) {
      const file = await axios($, {
        url: this.url,
        responseType: "arraybuffer",
      });
      return file.toString("base64");
    },
    buildFormData(fileBase64) {
      const form = new URLSearchParams();
      form.append("type", this.documentType);
      form.append("base64File", JSON.stringify({
        base64String: `data:${this.extension.value};base64,${fileBase64}`,
        filename: this.filename + this.extension.label,
      }));
      return form;
    },
  },
  async run({ $ }) {
    const fileBase64 = await this.downloadFile({
      $,
    });
    const data = this.buildFormData(fileBase64);

    const response = await this.drata.uploadDeviceComplianceDocument({
      deviceId: this.deviceId,
      data,
    });

    $.export("$summary", "Succesfully uploaded compliance document");

    return response;
  },
};

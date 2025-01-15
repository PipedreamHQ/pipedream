import { axios } from "@pipedream/platform";
import FormData from "form-data";

export default {
  type: "app",
  app: "ocrspace",
  version: "0.0.{{ts}}",
  propDefinitions: {
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to receive notifications of completed OCR processing.",
    },
    monitoredFolder: {
      type: "string",
      label: "Monitored Folder",
      description: "Optional folder to monitor for new file uploads.",
      optional: true,
    },
    processingQueue: {
      type: "string",
      label: "Processing Queue",
      description: "Optional processing queue to monitor for new file uploads.",
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "Image File URL",
      description: "The URL of the image file to submit for OCR processing.",
      optional: true,
    },
    imageFile: {
      type: "file",
      label: "Image File Upload",
      description: "The image file to submit for OCR processing.",
      optional: true,
    },
    imageLanguage: {
      type: "string",
      label: "Image Language",
      description: "Optional language setting for image OCR processing.",
      optional: true,
      options: [
        {
          label: "Arabic",
          value: "ara",
        },
        {
          label: "Bulgarian",
          value: "bul",
        },
        {
          label: "Chinese (Simplified)",
          value: "chs",
        },
        {
          label: "Chinese (Traditional)",
          value: "cht",
        },
        {
          label: "Croatian",
          value: "hrv",
        },
        {
          label: "Czech",
          value: "cze",
        },
        {
          label: "Danish",
          value: "dan",
        },
        {
          label: "Dutch",
          value: "dut",
        },
        {
          label: "English",
          value: "eng",
        },
        {
          label: "Finnish",
          value: "fin",
        },
        {
          label: "French",
          value: "fre",
        },
        {
          label: "German",
          value: "ger",
        },
        {
          label: "Greek",
          value: "gre",
        },
        {
          label: "Hungarian",
          value: "hun",
        },
        {
          label: "Korean",
          value: "kor",
        },
        {
          label: "Italian",
          value: "ita",
        },
        {
          label: "Japanese",
          value: "jpn",
        },
        {
          label: "Polish",
          value: "pol",
        },
        {
          label: "Portuguese",
          value: "por",
        },
        {
          label: "Russian",
          value: "rus",
        },
        {
          label: "Slovenian",
          value: "slv",
        },
        {
          label: "Spanish",
          value: "spa",
        },
        {
          label: "Swedish",
          value: "swe",
        },
        {
          label: "Turkish",
          value: "tur",
        },
      ],
    },
    pdfUrl: {
      type: "string",
      label: "PDF File URL",
      description: "The URL of the PDF file to submit for OCR processing.",
      optional: true,
    },
    pdfFile: {
      type: "file",
      label: "PDF File Upload",
      description: "The PDF file to submit for OCR processing.",
      optional: true,
    },
    pdfLanguage: {
      type: "string",
      label: "PDF Language",
      description: "Optional language setting for PDF OCR processing.",
      optional: true,
      options: [
        {
          label: "Arabic",
          value: "ara",
        },
        {
          label: "Bulgarian",
          value: "bul",
        },
        {
          label: "Chinese (Simplified)",
          value: "chs",
        },
        {
          label: "Chinese (Traditional)",
          value: "cht",
        },
        {
          label: "Croatian",
          value: "hrv",
        },
        {
          label: "Czech",
          value: "cze",
        },
        {
          label: "Danish",
          value: "dan",
        },
        {
          label: "Dutch",
          value: "dut",
        },
        {
          label: "English",
          value: "eng",
        },
        {
          label: "Finnish",
          value: "fin",
        },
        {
          label: "French",
          value: "fre",
        },
        {
          label: "German",
          value: "ger",
        },
        {
          label: "Greek",
          value: "gre",
        },
        {
          label: "Hungarian",
          value: "hun",
        },
        {
          label: "Korean",
          value: "kor",
        },
        {
          label: "Italian",
          value: "ita",
        },
        {
          label: "Japanese",
          value: "jpn",
        },
        {
          label: "Polish",
          value: "pol",
        },
        {
          label: "Portuguese",
          value: "por",
        },
        {
          label: "Russian",
          value: "rus",
        },
        {
          label: "Slovenian",
          value: "slv",
        },
        {
          label: "Spanish",
          value: "spa",
        },
        {
          label: "Swedish",
          value: "swe",
        },
        {
          label: "Turkish",
          value: "tur",
        },
      ],
    },
    pdfPages: {
      type: "string",
      label: "PDF Pages",
      description: "Optional specific pages to process in the PDF file.",
      optional: true,
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The Job ID to retrieve the processed OCR result.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ocr.space";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "POST", path = "/parse/image", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          apikey: this.$auth.apikey,
        },
      });
    },
    async submitImage(opts = {}) {
      const {
        imageUrl, imageFile, imageLanguage,
      } = opts;
      const formData = new FormData();
      if (imageUrl) {
        formData.append("url", imageUrl);
      }
      if (imageFile) {
        formData.append("file", imageFile);
      }
      formData.append("isOverlayRequired", false);
      if (imageLanguage) {
        formData.append("language", imageLanguage);
      }
      return this._makeRequest({
        path: "/parse/image",
        method: "POST",
        data: formData,
        headers: formData.getHeaders(),
      });
    },
    async submitPdf(opts = {}) {
      const {
        pdfUrl, pdfFile, pdfLanguage, pdfPages,
      } = opts;
      const formData = new FormData();
      if (pdfUrl) {
        formData.append("url", pdfUrl);
      }
      if (pdfFile) {
        formData.append("file", pdfFile);
      }
      formData.append("isOverlayRequired", false);
      if (pdfLanguage) {
        formData.append("language", pdfLanguage);
      }
      if (pdfPages) {
        formData.append("pages", pdfPages);
      }
      return this._makeRequest({
        path: "/parse/image",
        method: "POST",
        data: formData,
        headers: formData.getHeaders(),
      });
    },
    async retrieveOcrResult(opts = {}) {
      const { jobId } = opts;
      const path = `/parse/image/${jobId}`;
      return this._makeRequest({
        path,
        method: "GET",
      });
    },
    async emitOcrJobCompleted(data) {
      const { webhookUrl } = this;
      await axios(this, {
        method: "POST",
        url: webhookUrl,
        data,
      });
    },
    async emitNewFileUploaded(data) {
      const { webhookUrl } = this;
      await axios(this, {
        method: "POST",
        url: webhookUrl,
        data,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};

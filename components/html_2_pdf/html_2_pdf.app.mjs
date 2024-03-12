import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "html_2_pdf",
  propDefinitions: {
    source: {
      type: "string",
      label: "Source Type",
      description: "Indicates whether the input is a URL or HTML string.",
      options: [
        {
          label: "URL",
          value: "url",
        },
        {
          label: "HTML",
          value: "html",
        },
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The URL or HTML string to convert to PDF.",
    },
    licenseKey: {
      type: "string",
      label: "License Key",
      description: "Your HTML2PDF license key.",
      secret: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.html2pdf.co.uk/";
    },
    async createPdf({
      source, content, licenseKey,
    }) {
      const urlEncodedContent = encodeURIComponent(content);
      const parameter = source === "url"
        ? "url"
        : "html";
      const response = await axios(this, {
        method: "POST",
        url: this._baseUrl(),
        params: {
          license: licenseKey,
          [parameter]: urlEncodedContent,
        },
        responseType: "arraybuffer",
      });

      const path = `/tmp/${Date.now()}.pdf`;
      require("fs").writeFileSync(path, response, "binary");
      return path;
    },
  },
  version: "0.0.1",
};

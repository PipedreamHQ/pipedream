import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "diffchecker",
  propDefinitions: {
    outputType: {
      type: "string",
      label: "Output Type",
      description: "Specifies the type of output you receive in the response body.",
      options: [
        {
          label: "JSON",
          value: "json",
        },
        {
          label: "HTML",
          value: "html",
        },
        {
          label: "HTML JSON",
          value: "html_json",
        },
        {
          label: "PNG",
          value: "png",
        },
      ],
    },
    diffLevel: {
      type: "string",
      label: "Diff Level",
      description: "Specifies whether you want to diff by word or character.",
      options: [
        {
          label: "Word",
          value: "word",
        },
        {
          label: "Character",
          value: "character",
        },
      ],
      optional: true,
    },
    leftText: {
      type: "string",
      label: "Left Text",
      description: "Left text you want to compare.",
    },
    rightText: {
      type: "string",
      label: "Right Text",
      description: "Right text you want to compare.",
    },
    leftPdf: {
      type: "string[]",
      label: "Left PDF",
      description: "Left PDF file you want to compare. Provide the file path or URL.",
    },
    rightPdf: {
      type: "string[]",
      label: "Right PDF",
      description: "Right PDF file you want to compare. Provide the file path or URL.",
    },
    leftImage: {
      type: "string[]",
      label: "Left Image",
      description: "Left image you want to compare. Provide the file path or URL.",
    },
    rightImage: {
      type: "string[]",
      label: "Right Image",
      description: "Right image you want to compare. Provide the file path or URL.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.diffchecker.com/public";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Api-Key": this.$auth.api_key,
        },
        ...otherOpts,
      });
    },
    async compareText({
      outputType, diffLevel, leftText, rightText,
    }) {
      return this._makeRequest({
        path: "/text",
        params: {
          output_type: outputType,
          diff_level: diffLevel,
        },
        data: {
          left: leftText,
          right: rightText,
        },
      });
    },
    async comparePdfs({
      outputType, diffLevel, leftPdf, rightPdf,
    }) {
      return this._makeRequest({
        path: "/pdf",
        params: {
          output_type: outputType,
          diff_level: diffLevel,
        },
        data: {
          left_pdf: leftPdf,
          right_pdf: rightPdf,
        },
      });
    },
    async compareImages({
      outputType, leftImage, rightImage,
    }) {
      return this._makeRequest({
        path: "/image",
        params: {
          output_type: outputType,
        },
        data: {
          left_image: leftImage,
          right_image: rightImage,
        },
      });
    },
  },
};
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "filestack",
  propDefinitions: {
    imageSource: {
      type: "string",
      label: "Image Source URL",
      description: "The source URL of the image to be transformed.",
    },
    transformationType: {
      type: "string",
      label: "Transformation Type",
      description: "The type of transformation to apply to the image.",
      options: [
        {
          label: "Resize",
          value: "resize",
        },
        {
          label: "Rotate",
          value: "rotate",
        },
        {
          label: "Blur",
          value: "blur",
        },
        {
          label: "Sharpen",
          value: "sharpen",
        },
        {
          label: "Flip",
          value: "flip",
        },
        {
          label: "Sepia",
          value: "sepia",
        },
        {
          label: "Monochrome",
          value: "monochrome",
        },
      ],
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width to resize the image to, in pixels. Required for resize transformation.",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height to resize the image to, in pixels. Required for resize transformation.",
      optional: true,
    },
    rotationDegree: {
      type: "integer",
      label: "Rotation Degree",
      description: "The degree to rotate the image. Required for rotate transformation.",
      optional: true,
    },
    blurAmount: {
      type: "integer",
      label: "Blur Amount",
      description: "The amount to blur the image. Required for blur transformation.",
      optional: true,
    },
    sharpenAmount: {
      type: "integer",
      label: "Sharpen Amount",
      description: "The amount to sharpen the image. Required for sharpen transformation.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.filestackapi.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async transformImage({
      imageSource, transformationType, rotationDegree, width, height, blurAmount, sharpenAmount,
    }) {
      let transformationPath = "";
      switch (transformationType) {
      case "resize":
        transformationPath = `resize=width:${width},height:${height}`;
        break;
      case "rotate":
        transformationPath = `rotate=deg:${rotationDegree}`;
        break;
      case "blur":
        transformationPath = `blur=amount:${blurAmount}`;
        break;
      case "sharpen":
        transformationPath = `sharpen=amount:${sharpenAmount}`;
        break;
      case "flip":
        transformationPath = "flip";
        break;
      case "sepia":
        transformationPath = "sepia";
        break;
      case "monochrome":
        transformationPath = "monochrome";
        break;
      default:
        throw new Error("Unsupported transformation type");
      }

      return this._makeRequest({
        path: `/file/${transformationPath}?key=${this.$auth.api_key}&url=${encodeURIComponent(imageSource)}`,
      });
    },
  },
};

import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "filestack",
  propDefinitions: {
    fileOrUrl: {
      type: "string",
      label: "Image Path or URL",
      description:
        "The path to an image file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp). Alternatively, you can pass the direct URL to an image file.",
    },
    uploadedImageUrl: {
      type: "string",
      label: "Uploaded Image URL",
      description:
        "The URL of an image uploaded to FileStack (you can use the **Upload Image** action). Example: `https://cdn.filestackcontent.com/pdn7PhZdT02GoYZCVYeF`",
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
    rotationDegree: {
      type: "integer",
      label: "Rotation Degree",
      description:
        "The degree to rotate the image. Required for rotate transformation.",
      optional: true,
    },
    blurAmount: {
      type: "integer",
      label: "Blur Amount",
      description:
        "The amount to blur the image. Required for blur transformation.",
      optional: true,
    },
    sharpenAmount: {
      type: "integer",
      label: "Sharpen Amount",
      description:
        "The amount to sharpen the image. Required for sharpen transformation.",
      optional: true,
    },
  },
  methods: {
    _getAuth() {
      return this.$auth.api_key;
    },
    async _makeRequest({
      $ = this, ...otherOpts
    }) {
      return axios($, otherOpts);
    },
    async uploadImage(args) {
      return this._makeRequest({
        url: "https://www.filestackapi.com/api/store/S3",
        method: "POST",
        params: {
          key: this._getAuth(),
        },
        ...args,
      });
    },
    async transformImage({
      transformations, uploadedImageUrl, ...args
    }) {
      const handle = uploadedImageUrl.split("/").pop();
      return this._makeRequest({
        url: [
          "https://cdn.filestackcontent.com",
          this._getAuth(),
          transformations,
          handle,
        ].join("/"),
        responseType: "arraybuffer",
        ...args,
      });
    },
  },
};

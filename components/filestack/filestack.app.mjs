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
    outputFilename: {
      type: "string",
      label: "Output File Name",
      description: "If specified, the resulting image will be written to this filename in the `tmp` folder; otherwise, the raw data will be returned",
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

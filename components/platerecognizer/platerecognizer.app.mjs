import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "platerecognizer",
  propDefinitions: {
    imageFileOrUrl: {
      type: "string",
      label: "Image File or URL",
      description: "The image file or URL to be recognized.",
    },
    regions: {
      type: "string[]",
      label: "Regions",
      description: "Regions to select specific license plate patterns. Use comma-separated values for multiple regions (e.g., us-ca,us-ny).",
      optional: true,
    },
    cameraId: {
      type: "string",
      label: "Camera ID",
      description: "The ID of the camera that took the image.",
      optional: true,
    },
    mmc: {
      type: "boolean",
      label: "MMC",
      description: "Whether to detect vehicle make, model, and color.",
      optional: true,
    },
    config: {
      type: "string",
      label: "Config",
      description: "Additional configuration in JSON format.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.platerecognizer.com/v1";
    },
    async triggerRecognition({
      imageFileOrUrl, regions, cameraId, mmc, config,
    }) {
      const formData = new FormData();
      if (imageFileOrUrl.startsWith("http")) {
        formData.append("upload", imageFileOrUrl);
      } else {
        // Assuming the use of Node.js environment, fs should be used for local files
        // And since the file needs to be read as a stream, ensure fs is properly imported
        const fs = require("fs");
        formData.append("upload", fs.createReadStream(imageFileOrUrl));
      }
      if (regions) formData.append("regions", regions.join(","));
      if (cameraId) formData.append("camera_id", cameraId);
      if (mmc !== undefined) formData.append("mmc", mmc);
      if (config) formData.append("config", config);

      return axios(this, {
        method: "POST",
        url: `${this._baseUrl()}/plate-reader/`,
        headers: {
          "Authorization": `Token ${this.$auth.api_key}`,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
    },
  },
};

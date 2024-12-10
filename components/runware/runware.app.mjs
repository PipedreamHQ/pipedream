import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "runware",
  propDefinitions: {
    taskType: {
      type: "string",
      label: "Task Type",
      description: "The type of task to be processed by the Runware API.",
      options: Object.values(constants.TASK_TYPE),
    },
    outputType: {
      type: "string",
      label: "Output Type",
      description: "Specifies the output type in which the image is returned.",
      optional: true,
      options: [
        "base64Data",
        "dataURI",
        "URL",
      ],
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "Specifies the format of the output image.",
      optional: true,
      options: [
        "PNG",
        "JPG",
        "WEBP",
      ],
    },
    includeCost: {
      type: "boolean",
      label: "Include Cost",
      description: "If set to `true`, the cost to perform the task will be included in the response object. Defaults to `false`.",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Used to define the height dimension of the generated image. Certain models perform better with specific dimensions. The value must be divisible by 64, eg: `512`, `576`, `640` ... `2048`.",
      min: 512,
      max: 2048,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Used to define the width dimension of the generated image. Certain models perform better with specific dimensions. The value must be divisible by 64, eg: `512`, `576`, `640` ... `2048`.",
      min: 512,
      max: 2048,
    },
    inputImage: {
      type: "string",
      label: "Input Image",
      description: "Specifies the input image to be processed. The image can be specified in one of the following formats:\n - An UUID v4 string of a [previously uploaded image](https://docs.runware.ai/en/getting-started/image-upload) or a [generated image](https://docs.runware.ai/en/image-inference/api-reference).\n - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.\n - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.\n - A URL pointing to the image. The image must be accessible publicly.\nSupported formats are: PNG, JPG and WEBP.",
    },
  },
  methods: {
    getUrl(path = "") {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async makeRequest({
      $ = this, path, headers, ...args
    }) {
      const response = await axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
      if (response.errors) {
        throw new Error(JSON.stringify(response.errors));
      }
      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};

import app from "../../shotstack.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "shotstack-upload-asset",
  name: "Upload Asset",
  description: "Add media assets like images, audio, or video to the Shotstack API for use in video projects. [See the documentation here](https://shotstack.io/docs/api/?shell#fetch-source).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the asset to upload.",
    },
    callback: {
      description: "The URL to which the API will send a callback when the asset has been processed.",
      optional: true,
      propDefinition: [
        app,
        "callback",
      ],
    },
  },
  methods: {
    uploadAsset(args = {}) {
      return this.app.post({
        apiPath: constants.API.INGEST,
        path: "/sources",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      url,
      callback,
    } = this;

    const response =
      await this.uploadAsset({
        step,
        data: {
          url,
          callback,
        },
      });

    step.export("$summary", `Uploaded file with id ${response.data.id}`);

    return response;
  },
};

import app from "../../shotstack.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-start-render",
  name: "Start Render",
  description: "Initiate rendering of a video using a timeline created in Shotstack API. [See the documentation here](https://shotstack.io/docs/api/?shell#render-asset).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    timeline: {
      type: "string",
      label: "Timeline",
      description: "The timeline to render. [See the documentation for the timeline object here](https://shotstack.io/docs/api/?shell#tocs_timeline)",
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "The output format and type of media file to generate.",
      options: Object.values(constants.OUTPUT_FORMAT),
    },
    outputResolution: {
      type: "string",
      label: "Output Resolution",
      description: "The output resolution of the video or image.",
      options: Object.values(constants.OUTPUT_RESOLUTION),
    },
    callback: {
      description: "An optional webhook callback URL used to receive status notifications when a render completes or fails.",
      optional: true,
      propDefinition: [
        app,
        "callback",
      ],
    },
  },
  methods: {
    startRender(args = {}) {
      return this.app.post({
        path: "/render",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      timeline,
      outputFormat,
      outputResolution,
      callback,
    } = this;

    const response =
      await this.startRender({
        step,
        data: {
          timeline: utils.parse(timeline),
          output: {
            format: outputFormat,
            resolution: outputResolution,
          },
          callback,
        },
      });

    step.export("$summary", `Render started with id ${response.response.id}`);

    return response;
  },
};

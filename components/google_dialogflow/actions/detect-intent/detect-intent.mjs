import googleDialogflow from "../../google_dialogflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "google_dialogflow-detect-intent",
  version: "0.0.1",
  name: "Detect Intent",
  description: "Processes a natural language query and returns structured, actionable data as a result, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.sessions/detectIntent) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Sessions.html#detectIntent2)",
  props: {
    googleDialogflow,
    sessionId: {
      propDefinition: [
        googleDialogflow,
        "sessionId",
      ],
    },
    queryParams: {
      label: "Query Params",
      description: "Properties of Query Parameters, See [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.IQueryParameters.html)",
      type: "object",
      optional: true,
    },
    queryInput: {
      label: "Query Input",
      description: "Properties of a Query Input, See [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.IQueryInput.html)",
      type: "object",
      optional: true,
    },
    outputAudioConfig: {
      label: "Output Audio Config",
      description: "Properties of an Output Audio Config, See [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.IOutputAudioConfig.html)",
      type: "object",
      optional: true,
    },
    outputAudioConfigMask: {
      label: "Output Audio Config Mask",
      description: "Properties of a Field Mask, See [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.protobuf.IFieldMask.html)",
      type: "object",
      optional: true,
    },
    inputAudioFile: {
      label: "Input Audio",
      description: "Please provide a file path, e.g. `/tmp/recording.mp3`",
      type: "object",
      optional: true,
    },
  },
  async run({ $ }) {
    await this.googleDialogflow.detectIntent({
      session: this.sessionId,
      queryParams: utils.parseObject(this.queryParams),
      queryInput: utils.parseObject(this.queryInput),
      outputAudioConfig: utils.parseObject(this.outputAudioConfig),
      outputAudioConfigMask: utils.parseObject(this.outputAudioConfigMask),
      inputAudioFile: this.inputAudioFile,
    });
    $.export("$summary", "Configured query has been sent.");
  },
};

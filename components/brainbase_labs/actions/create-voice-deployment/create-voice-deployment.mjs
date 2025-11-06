import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-create-voice-deployment",
  name: "Create Voice Deployment",
  description:
    "Create a new voice deployment. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    workerId: {
      propDefinition: [app, "workerId"],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Deployment name",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number for deployment (e.g., +1234567890)",
    },
    flowId: {
      propDefinition: [
        app,
        "flowId",
        (c) => ({
          workerId: c.workerId,
        }),
      ],
    },
    enableVoiceSentiment: {
      type: "boolean",
      label: "Enable Voice Sentiment",
      description: "Enable voice sentiment analysis",
      default: false,
    },
    externalConfig: {
      type: "object",
      label: "External Config",
      description:
        'External configuration object with voice settings, language, voiceId, etc. Example: `{"voice": "alloy", "language": "en"}`',
      optional: true,
    },
    extractions: {
      type: "object",
      label: "Extractions",
      description: "Custom data extraction configurations (optional)",
      optional: true,
    },
    successCriteria: {
      type: "string[]",
      label: "Success Criteria",
      description: "Deployment success measurement criteria (optional)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createVoiceDeployment({
      $,
      workerId: this.workerId,
      data: {
        name: this.name,
        phoneNumber: this.phoneNumber,
        flowId: this.flowId,
        enableVoiceSentiment: this.enableVoiceSentiment,
        ...(this.externalConfig && {
          externalConfig: this.externalConfig,
        }),
        ...(this.extractions && {
          extractions: this.extractions,
        }),
        ...(this.successCriteria && {
          successCriteria: this.successCriteria,
        }),
      },
    });

    $.export(
      "$summary",
      `Successfully created voice deployment "${this.name}"`
    );
    return response;
  },
};

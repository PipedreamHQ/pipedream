import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-update-voice-deployment",
  name: "Update Voice Deployment",
  description: "Update an existing voice deployment. [See the documentation](https://docs.usebrainbase.com)",
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
      propDefinition: [
        app,
        "workerId",
      ],
    },
    deploymentId: {
      propDefinition: [
        app,
        "deploymentId",
        (c) => ({
          workerId: c.workerId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Deployment name",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number for deployment",
      optional: true,
    },
    flowId: {
      propDefinition: [
        app,
        "flowId",
        (c) => ({
          workerId: c.workerId,
        }),
      ],
      optional: true,
    },
    externalConfig: {
      type: "object",
      label: "External Config",
      description: "External configuration object",
      optional: true,
    },
    enableVoiceSentiment: {
      type: "boolean",
      label: "Enable Voice Sentiment",
      description: "Enable voice sentiment analysis",
      optional: true,
    },
    extractions: {
      type: "object",
      label: "Extractions",
      description: "Extractions configuration",
      optional: true,
    },
    customWebhooks: {
      type: "string[]",
      label: "Custom Webhooks",
      description: "Custom webhooks array",
      optional: true,
    },
    successCriteria: {
      type: "string[]",
      label: "Success Criteria",
      description: "Success criteria array",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateVoiceDeployment({
      $,
      workerId: this.workerId,
      deploymentId: this.deploymentId,
      data: {
        name: this.name,
        phoneNumber: this.phoneNumber,
        flowId: this.flowId,
        externalConfig: this.externalConfig,
        enableVoiceSentiment: this.enableVoiceSentiment,
        extractions: this.extractions,
        customWebhooks: this.customWebhooks,
        successCriteria: this.successCriteria,
      },
    });

    $.export("$summary", `Successfully updated voice deployment with ID ${this.deploymentId}`);
    return response;
  },
};


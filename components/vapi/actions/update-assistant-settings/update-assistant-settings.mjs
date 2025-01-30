import vapi from "../../vapi.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vapi-update-assistant-settings",
  name: "Update Assistant Settings",
  description: "Updates the configuration settings for a specific assistant. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vapi,
    assistantId: {
      propDefinition: [
        "vapi",
        "assistantId",
      ],
    },
    transcriber: {
      propDefinition: [
        "vapi",
        "transcriber",
      ],
      optional: true,
    },
    model: {
      propDefinition: [
        "vapi",
        "model",
      ],
      optional: true,
    },
    voice: {
      propDefinition: [
        "vapi",
        "voice",
      ],
      optional: true,
    },
    firstMessage: {
      propDefinition: [
        "vapi",
        "firstMessage",
      ],
      optional: true,
    },
    firstMessageMode: {
      propDefinition: [
        "vapi",
        "firstMessageMode",
      ],
      optional: true,
    },
    hipaaEnabled: {
      propDefinition: [
        "vapi",
        "hipaaEnabled",
      ],
      optional: true,
    },
    clientMessages: {
      propDefinition: [
        "vapi",
        "clientMessages",
      ],
      optional: true,
    },
    serverMessages: {
      propDefinition: [
        "vapi",
        "serverMessages",
      ],
      optional: true,
    },
    silenceTimeoutSeconds: {
      propDefinition: [
        "vapi",
        "silenceTimeoutSeconds",
      ],
      optional: true,
    },
    backgroundSound: {
      propDefinition: [
        "vapi",
        "backgroundSound",
      ],
      optional: true,
    },
    backgroundDenoisingEnabled: {
      propDefinition: [
        "vapi",
        "backgroundDenoisingEnabled",
      ],
      optional: true,
    },
    modelOutputInMessagesEnabled: {
      propDefinition: [
        "vapi",
        "modelOutputInMessagesEnabled",
      ],
      optional: true,
    },
    transportConfigurations: {
      propDefinition: [
        "vapi",
        "transportConfigurations",
      ],
      optional: true,
    },
    credentials: {
      propDefinition: [
        "vapi",
        "credentials",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        "vapi",
        "name",
      ],
      optional: true,
    },
    voicemailDetection: {
      propDefinition: [
        "vapi",
        "voicemailDetection",
      ],
      optional: true,
    },
    endCallMessage: {
      propDefinition: [
        "vapi",
        "endCallMessage",
      ],
      optional: true,
    },
    endCallPhrases: {
      propDefinition: [
        "vapi",
        "endCallPhrases",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        "vapi",
        "metadata",
      ],
      optional: true,
    },
    analysisPlan: {
      propDefinition: [
        "vapi",
        "analysisPlan",
      ],
      optional: true,
    },
    artifactPlan: {
      propDefinition: [
        "vapi",
        "artifactPlan",
      ],
      optional: true,
    },
    messagePlan: {
      propDefinition: [
        "vapi",
        "messagePlan",
      ],
      optional: true,
    },
    startSpeakingPlan: {
      propDefinition: [
        "vapi",
        "startSpeakingPlan",
      ],
      optional: true,
    },
    stopSpeakingPlan: {
      propDefinition: [
        "vapi",
        "stopSpeakingPlan",
      ],
      optional: true,
    },
    monitorPlan: {
      propDefinition: [
        "vapi",
        "monitorPlan",
      ],
      optional: true,
    },
    credentialIds: {
      propDefinition: [
        "vapi",
        "credentialIds",
      ],
      optional: true,
    },
    server: {
      propDefinition: [
        "vapi",
        "server",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    const optionalProps = [
      "transcriber",
      "model",
      "voice",
      "firstMessage",
      "firstMessageMode",
      "hipaaEnabled",
      "clientMessages",
      "serverMessages",
      "silenceTimeoutSeconds",
      "backgroundSound",
      "backgroundDenoisingEnabled",
      "modelOutputInMessagesEnabled",
      "transportConfigurations",
      "credentials",
      "name",
      "voicemailDetection",
      "endCallMessage",
      "endCallPhrases",
      "metadata",
      "analysisPlan",
      "artifactPlan",
      "messagePlan",
      "startSpeakingPlan",
      "stopSpeakingPlan",
      "monitorPlan",
      "credentialIds",
      "server",
    ];

    for (const prop of optionalProps) {
      if (this[prop] !== undefined && this[prop] !== null && this[prop] !== "") {
        data[prop] = this[prop];
      }
    }

    const assistantId = this.assistantId;
    const response = await this.vapi.updateAssistant(assistantId, data);
    $.export("$summary", `Updated assistant ${assistantId} successfully`);
    return response;
  },
};

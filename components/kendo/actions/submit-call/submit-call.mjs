import kendo from "../../kendo.app.mjs";

export default {
  key: "kendo-submit-call",
  name: "Submit Call for Analysis",
  description:
    "Submits a call recording or transcript to Kendo AI for analysis via the Push API. [See the documentation](https://docs.kendo.ai/docs/push-api)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  props: {
    kendo,
    audioUrl: {
      type: "string",
      label: "Audio URL",
      description:
        "Publicly accessible URL of the call recording. Kendo will download and transcribe this. Required if **Transcript** is not provided.",
      optional: true,
    },
    transcript: {
      type: "string",
      label: "Transcript",
      description:
        "Plain-text transcript of the call. Required if **Audio URL** is not provided. If both are supplied, audio takes priority.",
      optional: true,
    },
    repName: {
      propDefinition: [
        kendo,
        "repName",
      ],
    },
    repEmail: {
      propDefinition: [
        kendo,
        "repEmail",
      ],
    },
    callTitle: {
      propDefinition: [
        kendo,
        "callTitle",
      ],
    },
    disableAiTitle: {
      propDefinition: [
        kendo,
        "disableAiTitle",
      ],
    },
    callDate: {
      propDefinition: [
        kendo,
        "callDate",
      ],
    },
    duration: {
      propDefinition: [
        kendo,
        "duration",
      ],
    },
    metadata: {
      propDefinition: [
        kendo,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    if (!this.audioUrl && !this.transcript) {
      throw new Error(
        "At least one of Audio URL or Transcript must be provided.",
      );
    }

    const body = {
      ...(this.audioUrl && {
        audioUrl: this.audioUrl,
      }),
      ...(this.transcript && {
        transcript: this.transcript,
      }),
      ...(this.repName && {
        repName: this.repName,
      }),
      ...(this.repEmail && {
        repEmail: this.repEmail,
      }),
      ...(this.callTitle && {
        callTitle: this.callTitle,
      }),
      ...(this.disableAiTitle !== undefined && {
        disableAiTitleGeneration: this.disableAiTitle,
      }),
      ...(this.callDate && {
        callDate: this.callDate,
      }),
      ...(this.duration && {
        duration: this.duration,
      }),
      ...(this.metadata && {
        metadata: this.metadata,
      }),
    };

    const response = await this.kendo.submitCall({
      $,
      data: body,
    });

    $.export(
      "$summary",
      `Call submitted successfully. Call ID: ${response.callId}`,
    );
    return response;
  },
};

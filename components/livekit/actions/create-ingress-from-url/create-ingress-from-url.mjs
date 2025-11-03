import { IngressInput } from "livekit-server-sdk";
import app from "../../livekit.app.mjs";

export default {
  key: "livekit-create-ingress-from-url",
  name: "Create Ingress From URL",
  description: "Create a new ingress from url in LiveKit. [See the documentation](https://docs.livekit.io/home/ingress/overview/#url-input-example).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    roomName: {
      description: "The name of the room to send media to",
      propDefinition: [
        app,
        "room",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL of the media to pull for ingresses of type URL",
    },
    participantIdentity: {
      type: "string",
      label: "Participant Identity",
      description: "Unique identity of the participant",
    },
    participantName: {
      type: "string",
      label: "Participant Name",
      description: "Participant display name",
      optional: true,
    },
    participantMetadata: {
      type: "string",
      label: "Participant Metadata",
      description: "Metadata to attach to the participant",
      optional: true,
    },
    name: {
      type: "string",
      label: "Ingress Name",
      description: "The name of the ingress",
      optional: true,
    },
    bypassTranscoding: {
      type: "boolean",
      label: "Bypass Transcoding",
      description: "Whether to skip transcoding and forward the input media directly. Only supported by WHIP",
      optional: true,
    },
    enableTranscoding: {
      type: "boolean",
      label: "Enable Transcoding",
      description: "Whether to enable transcoding or forward the input media directly. Transcoding is required for all input types except WHIP. For WHIP, the default is to not transcode.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      roomName,
      participantIdentity,
      participantName,
      participantMetadata,
      bypassTranscoding,
      enableTranscoding,
      url,
    } = this;

    const response = await app.createIngress({
      inputType: IngressInput.URL_INPUT,
      name,
      roomName,
      participantIdentity,
      participantName,
      participantMetadata,
      bypassTranscoding,
      enableTranscoding,
      url,
    });
    $.export("$summary", `Successfully created ingress with ID \`${response.ingressId}\`.`);
    return response;
  },
};

import claap from "../../claap.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "claap-create-recording",
  name: "Create Recording",
  description: "Create a new recording in Claap. [See the documentation](https://docs.claap.io/api-reference/endpoint/post_recording).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    claap,
    authorEmail: {
      type: "string",
      label: "Author Email",
      description: "Recording author email address. Must belong to a workspace user with permissions to create recordings.",
    },
    channelId: {
      propDefinition: [
        claap,
        "channelId",
      ],
      description: "Identifier of a folder (aka channel) where the recording should be created",
    },
    deal: {
      type: "object",
      label: "Deal",
      description: "A CRM deal reference to link to the recording. Requires meeting information and the workspace to be connected to the same CRM. Example: `{\"id\": \"deal-123\", \"type\": \"hubspot\"}`. Both `id` and `type` are required. Allowed types: `attio`, `hubspot`, `pipedrive`, `salesforce`.",
      optional: true,
    },
    downloadUrl: {
      type: "string",
      label: "Download URL",
      description: "URL where the recording video content can be retrieved using an HTTP GET request. Do not use the response upload URL if this parameter is supplied.",
      optional: true,
    },
    meetingStartedAt: {
      type: "string",
      label: "Meeting Started At",
      description: "Meeting start time in ISO 8601 format (e.g. `2026-04-03T14:30:00Z`)",
    },
    meetingEndedAt: {
      type: "string",
      label: "Meeting Ended At",
      description: "Meeting end time in ISO 8601 format (e.g. `2026-04-03T15:00:00Z`)",
    },
    meetingParticipants: {
      type: "string[]",
      label: "Meeting Participants",
      description: "Array of participant objects. Example: `[{\"name\": \"John\", \"email\": \"john@example.com\", \"isOrganizer\": true}]`. `name` is required.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Recording title",
      optional: true,
    },
    transcript: {
      type: "boolean",
      label: "Upload Transcript",
      description: "Set to `true` to signal intent to supply transcript data. The response will include a `metaUrl` upload attribute. Use it to send the transcript JSON payload with an HTTP PUT request. **Note:** the recording creation will only proceed once both the video and the transcript payloads have been sent.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Origin of the recording. Defaults to `Api` if none is provided.",
      optional: true,
      options: [
        "Aircall",
        "Allo",
        "Call",
        "GoogleMeet",
        "LemlistVoip",
        "Loom",
        "MsTeams",
        "Ringover",
        "Zoom",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      authorEmail: this.authorEmail,
      channelId: this.channelId,
      downloadUrl: this.downloadUrl,
      meeting: {
        startedAt: this.meetingStartedAt,
        endedAt: this.meetingEndedAt,
        participants: parseObject(this.meetingParticipants),
      },
      title: this.title,
      source: this.source,
    };
    if (this.deal) {
      data.deal = parseObject(this.deal);
    }
    if (this.transcript) {
      data.transcript = {
        type: "upload",
      };
    }
    const response = await this.claap.createRecording({
      $,
      data,
    });
    $.export("$summary", `Successfully created recording \`${response.result?.recording?.id}\`.`);
    return response;
  },
};

import ringcentral from "../../ringcentral.app.mjs";

export default {
  key: "ringcentral-create-meeting",
  name: "Create Meeting",
  description: "Creates a new meeting. See the API docs [here](https://developers.ringcentral.com/api-reference/Meeting-Management/createMeeting).",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ringcentral,
    accountId: {
      propDefinition: [
        ringcentral,
        "accountId",
      ],
    },
    extensionId: {
      propDefinition: [
        ringcentral,
        "extensionId",
      ],
      description: "Internal identifier of an extension.",
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "Topic of the meeting.",
      optional: true,
    },
    meetingType: {
      type: "string",
      description: "Meeting type.",
      optional: true,
      options: [
        "Instant",
        "Scheduled",
        "ScheduledRecurring",
        "Recurring",
      ],
    },
    schedule: {
      type: "object",
      optional: true,
    },
    password: {
      type: "string",
      optional: true,
    },
    host: {
      type: "object",
      optional: true,
    },
    allowJoinBeforeHost: {
      type: "boolean",
      optional: true,
    },
    startHostVideo: {
      type: "boolean",
      optional: true,
    },
    startParticipantsVideo: {
      type: "boolean",
      optional: true,
    },
    usePersonalMeetingId: {
      type: "boolean",
      optional: true,
    },
    audioOptions: {
      type: "any",
      optional: true,
    },
    recurrence: {
      type: "object",
      description: "Recurrence settings.",
      optional: true,
    },
    autoRecordType: {
      type: "string",
      description: "Automatic record type.",
      optional: true,
      options: [
        "local",
        "cloud",
        "none",
      ],
    },
  },
  async run({ $ }) {
    const {
      accountId,
      extensionId,
      topic,
      meetingType,
      schedule,
      password,
      host,
      allowJoinBeforeHost,
      startHostVideo,
      startParticipantsVideo,
      usePersonalMeetingId,
      audioOptions,
      recurrence,
      autoRecordType,
    } = this;

    const response =
      await this.ringcentral.createMeeting({
        accountId,
        extensionId,
        data: {
          topic,
          meetingType,
          schedule,
          password,
          host,
          allowJoinBeforeHost,
          startHostVideo,
          startParticipantsVideo,
          usePersonalMeetingId,
          audioOptions,
          recurrence,
          autoRecordType,
        },
      });

    $.export("$summary", `Successfully created meeting with ID ${response.id}`);

    return response;
  },
};

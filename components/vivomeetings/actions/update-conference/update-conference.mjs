import vivomeetings from "../../vivomeetings.app.mjs";

export default {
  key: "vivomeetings-update-conference",
  name: "Update Conference",
  description: "Updates an existing conference or webinar on VivoMeetings. [See the documentation](https://docs.google.com/viewerng/viewer?url=https://vivomeetings.com/wp-content/uploads/2023/01/Partner-APIs-v1.41.docx-1.pdf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vivomeetings,
    hostId: {
      propDefinition: [
        vivomeetings,
        "hostId",
      ],
    },
    conferenceId: {
      propDefinition: [
        vivomeetings,
        "conferenceId",
        ({ hostId }) => ({
          hostId,
        }),
      ],
    },
    subject: {
      propDefinition: [
        vivomeetings,
        "subject",
      ],
      optional: true,
    },
    agenda: {
      propDefinition: [
        vivomeetings,
        "agenda",
      ],
      optional: true,
    },
    start: {
      propDefinition: [
        vivomeetings,
        "start",
      ],
      optional: true,
    },
    timeZone: {
      propDefinition: [
        vivomeetings,
        "timeZone",
      ],
      optional: true,
    },
    duration: {
      propDefinition: [
        vivomeetings,
        "duration",
      ],
      optional: true,
    },
    autoRecord: {
      propDefinition: [
        vivomeetings,
        "autoRecord",
      ],
    },
    autoTranscribe: {
      propDefinition: [
        vivomeetings,
        "autoTranscribe",
      ],
    },
    oneTimeAccessCode: {
      propDefinition: [
        vivomeetings,
        "oneTimeAccessCode",
      ],
      optional: true,
    },
    muteMode: {
      propDefinition: [
        vivomeetings,
        "muteMode",
      ],
      optional: true,
    },
    participants: {
      propDefinition: [
        vivomeetings,
        "contactIds",
        ({ hostId }) => ({
          hostId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.vivomeetings.updateConference({
      $,
      data: {
        conference_id: this.conferenceId,
        subject: this.subject,
        agenda: this.agenda,
        start: this.start,
        time_zone: this.timeZone,
        duration: this.duration,
        auto_record: this.autoRecord,
        auto_transcribe: this.autoTranscribe,
        one_time_access_code: this.oneTimeAccessCode,
        mute_mode: this.muteMode,
        participants: this.participants,
      },
    });

    $.export("$summary", `Successfully updated the conference with ID ${this.conferenceId}`);
    return response;
  },
};

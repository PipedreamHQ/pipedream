import { parseObject } from "../../common/utils.mjs";
import vivomeetings from "../../vivomeetings.app.mjs";

export default {
  key: "vivomeetings-create-conference",
  name: "Create Conference",
  description: "Creates a new conference in VivoMeetings. [See the documentation](https://docs.google.com/viewerng/viewer?url=https://vivomeetings.com/wp-content/uploads/2023/01/Partner-APIs-v1.41.docx-1.pdf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vivomeetings,
    companyId: {
      propDefinition: [
        vivomeetings,
        "companyId",
      ],
    },
    hostId: {
      propDefinition: [
        vivomeetings,
        "hostId",
      ],
    },
    subject: {
      propDefinition: [
        vivomeetings,
        "subject",
      ],
    },
    agenda: {
      propDefinition: [
        vivomeetings,
        "agenda",
      ],
    },
    start: {
      propDefinition: [
        vivomeetings,
        "start",
      ],
    },
    timeZone: {
      propDefinition: [
        vivomeetings,
        "timeZone",
      ],
    },
    duration: {
      propDefinition: [
        vivomeetings,
        "duration",
      ],
    },
    autoRecord: {
      propDefinition: [
        vivomeetings,
        "autoRecord",
      ],
    },
    autoStream: {
      propDefinition: [
        vivomeetings,
        "autoStream",
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
    },
    secureUrl: {
      propDefinition: [
        vivomeetings,
        "secureUrl",
      ],
    },
    hostInitiatedRecording: {
      propDefinition: [
        vivomeetings,
        "hostInitiatedRecording",
      ],
      optional: true,
    },
    securityPin: {
      propDefinition: [
        vivomeetings,
        "securityPin",
      ],
    },
    muteMode: {
      propDefinition: [
        vivomeetings,
        "muteMode",
      ],
    },
    participants: {
      propDefinition: [
        vivomeetings,
        "contactIds",
        ({ hostId }) => ({
          hostId,
        }),
      ],
    },
    participantEmails: {
      propDefinition: [
        vivomeetings,
        "participantEmails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vivomeetings.createConference({
      $,
      data: {
        host_id: this.hostId,
        subject: this.subject,
        agenda: this.agenda,
        start: this.start,
        time_zone: this.timeZone,
        duration: this.duration,
        auto_record: this.autoRecord,
        auto_stream: this.autoStream,
        auto_transcribe: this.autoTranscribe,
        one_time_access_code: this.oneTimeAccessCode,
        secure_url: this.secureUrl,
        host_initiated_recording: this.hostInitiatedRecording,
        security_pin: this.securityPin,
        mute_mode: this.muteMode,
        participants: this.participants,
        participant_emails: parseObject(this.participantEmails)?.map((item) => ({
          email: item,
        })),
      },
    });

    $.export("$summary", `Conference with Id: "${response.conference_id}" created successfully`);
    return response;
  },
};

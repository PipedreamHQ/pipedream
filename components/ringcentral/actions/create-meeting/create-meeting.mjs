// legacy_hash_id: a_Xzi1MW
import { axios } from "@pipedream/platform";

export default {
  key: "ringcentral-create-meeting",
  name: "Create Meeting",
  description: "Creates a new meeting.",
  version: "0.1.1",
  type: "action",
  props: {
    ringcentral: {
      type: "app",
      app: "ringcentral",
    },
    serverURL: {
      type: "string",
      description: "The base endpoint host used for the RingCentral API.",
      optional: true,
    },
    account_id: {
      type: "string",
      description: "Internal identifier of a RingCentral account.",
    },
    extension_id: {
      type: "string",
      description: "Internal identifier of an extension.",
    },
    topic: {
      type: "string",
      description: "Topic of the meeting.",
      optional: true,
    },
    meeting_type: {
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
    meeting_password: {
      type: "string",
      optional: true,
    },
    host: {
      type: "object",
      optional: true,
    },
    allow_join_before_host: {
      type: "boolean",
      optional: true,
    },
    start_host_video: {
      type: "boolean",
      optional: true,
    },
    start_participants_video: {
      type: "boolean",
      optional: true,
    },
    user_personal_meeting_id: {
      type: "boolean",
      optional: true,
    },
    audio_options: {
      type: "any",
      optional: true,
    },
    recurrence: {
      type: "object",
      description: "Recurrence settings.",
      optional: true,
    },
    auto_record_type: {
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
  // See the API docs here: https://developers.ringcentral.com/api-reference/Meeting-Management/createMeeting

    const config = {
      method: "post",
      url: `${this.serverURL}/restapi/v1.0/account/${this.account_id}/extension/${this.extension_id}/meeting`,
      headers: {
        Authorization: `Bearer ${this.ringcentral.$auth.oauth_access_token}`,
      },
      data: {
        topic: this.topic,
        meetingType: this.meeting_type,
        schedule: this.schedule,
        password: this.meeting_password,
        host: this.host,
        allowJoinBeforeHost: this.allow_join_before_host,
        startHostVideo: this.start_host_video,
        startParticipantsVideo: this.start_participants_video,
        usePersonalMeetingId: this.user_personal_meeting_id,
        audioOptions: this.audio_options,
        recurrence: this.recurrence,
        autoRecordType: this.auto_record_type,
      },
    };
    return await axios($, config);
  },
};

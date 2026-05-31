import { MEETING_TYPE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import app from "../../goto_meeting.app.mjs";

export default {
  key: "goto_meeting-create-meeting",
  name: "Create Meeting",
  description: "Creates a scheduled meeting in GoTo Meeting. [See the documentation](https://developer.goto.com/GoToMeetingV1#tag/Meetings/operation/createMeeting)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the meeting",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the meeting in ISO 8601 format",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the meeting in ISO 8601 format",
    },
    passwordRequired: {
      type: "boolean",
      label: "Password Required",
      description: "Whether a password is required to join the meeting",
    },
    conferenceCallInfo: {
      type: "string",
      label: "Conference Call Info",
      description: "Information for the conference call",
    },
    meetingType: {
      type: "string",
      label: "Meeting Type",
      description: "The type of the meeting",
      options: MEETING_TYPE_OPTIONS,
    },
    coorganizerKeys: {
      type: "string[]",
      label: "Co-Organizer Keys",
      description: "Keys of the co-organizers for the meeting",
      optional: true,
    },
  },
  async run({ $ }) {
    const meeting = await this.app.createScheduledMeeting({
      $,
      data: {
        subject: this.subject,
        startTime: this.startTime,
        endTime: this.endTime,
        passwordRequired: this.passwordRequired,
        conferenceCallInfo: this.conferenceCallInfo,
        meetingType: this.meetingType,
        coorganizerKeys: parseObject(this.coorganizerKeys),
      },
    });
    $.export("$summary", `Meeting Created: ${meeting[0].meetingid}`);
    return meeting;
  },
};

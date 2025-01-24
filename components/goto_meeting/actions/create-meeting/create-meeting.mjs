import goto_meeting from "../../goto_meeting.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "goto_meeting-create-meeting",
  name: "Create Meeting",
  description: "Creates a scheduled meeting in GoTo Meeting. [See the documentation](), ",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    goto_meeting: {
      type: "app",
      app: "goto_meeting",
    },
    subject: {
      propDefinition: [
        goto_meeting,
        "subject",
      ],
    },
    startTime: {
      propDefinition: [
        goto_meeting,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        goto_meeting,
        "endTime",
      ],
    },
    passwordRequired: {
      propDefinition: [
        goto_meeting,
        "passwordRequired",
      ],
    },
    conferenceCallInfo: {
      propDefinition: [
        goto_meeting,
        "conferenceCallInfo",
      ],
    },
    meetingType: {
      propDefinition: [
        goto_meeting,
        "meetingType",
      ],
    },
    timezoneKey: {
      propDefinition: [
        goto_meeting,
        "timezoneKey",
      ],
      optional: true,
    },
    coorganizerKeys: {
      propDefinition: [
        goto_meeting,
        "coorganizerKeys",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const meeting = await this.goto_meeting.createScheduledMeeting({
      subject: this.subject,
      startTime: this.startTime,
      endTime: this.endTime,
      passwordRequired: this.passwordRequired,
      conferenceCallInfo: this.conferenceCallInfo,
      meetingType: this.meetingType,
      timezoneKey: this.timezoneKey,
      coorganizerKeys: this.coorganizerKeys,
    });
    $.export("$summary", `Meeting Created: ${meeting.subject}`);
    return meeting;
  },
};

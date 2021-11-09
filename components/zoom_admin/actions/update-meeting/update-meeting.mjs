import zoomAdmin from "../../zoom_admin.app.mjs";
import tzs from "../../zoom_tzs.mjs";
import daysOfTheWeek from "../../zoom_days_of_the_week.mjs";
import isArray from "lodash/isArray.js";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Update a meeting",
  description: "Update the details of a meeting. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingupdate)",
  key: "zoom_admin-action-update-a-meeting",
  version: "0.0.2",
  type: "action",
  props: {
    zoomAdmin,
    meeting: {
      propDefinition: [
        zoomAdmin,
        "meeting",
      ],
    },
    occurrenceId: {
      propDefinition: [
        zoomAdmin,
        "occurrenceId",
        ({ meeting }) => ({
          meeting,
        }),
      ],
      description: "The [meeting occurrence ID](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings). If you send this param, just the occurrence will be deleted. Otherwise, the entire meeting will be deleted",
    },
    topic: {
      type: "string",
      label: "Name",
      description: "The meeting's topic.",
      optional: true,
    },
    type: {
      type: "integer",
      label: "Type",
      description: "Default to `A scheduled meeting`. The type of the meeting",
      options: [
        {
          label: "An instant meeting",
          value: 1,
        },
        {
          label: "A scheduled meeting",
          value: 2,
        },
        {
          label: "A recurring meeting with no fixed time",
          value: 3,
        },
        {
          label: "A recurring meeting with fixed time",
          value: 8,
        },
      ],
      default: 8,
      optional: true,
    },
    preSchedule: {
      type: "boolean",
      label: "Pre Schedule",
      description: "Default to `false`. Whether to create a pre-scheduled meeting. This field only supports schedule meetings.",
      optional: true,
      default: false,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The meeting’s start time. This field is only used for scheduled and/or recurring meetings with a fixed time. This supports local time and GMT formats.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The meeting’s scheduled duration, **in minutes**. This field is only used for scheduled meetings.",
      optional: true,
    },
    scheduleFor: {
      type: "string",
      label: "Schedule For",
      description: "The email address or user ID of the user to schedule a meeting for.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezome to assign to the `startTime`. This field is only used for scheduled meetings. [Click here for Zoom timezone list documentation](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#timezones)",
      options: tzs,
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password required to join the meeting. By default, a password can **only** have a maximum length of `10` characters and only contain alphanumeric characters and the `@`, `-`, `_` and `*` characters.",
      optional: true,
    },
    agenda: {
      type: "string",
      label: "Agenda",
      description: "The meeting's agenda. This value has a maximum length of 2000 characters",
      optional: true,
    },
    recurrenceType: {
      type: "integer",
      label: "Recurrence Type",
      description: "Recurrence meeting types. This field will only be taken into consideration if the meeting type is `Meeting with fixed time`",
      optional: true,
      options: [
        {
          label: "Daily",
          value: 1,
        },
        {
          label: "Weekly",
          value: 2,
        },
        {
          label: "Monthly",
          value: 3,
        },
      ],
    },
    recurrenceRepeatInterval: {
      type: "integer",
      label: "Repeat Interval",
      description: "Define the interval at which the meeting should recur. For instance, if you would like to schedule a meeting that recurs every two months, you must set the value of this field as `2` and the value of the `Recurrence Type` parameter as `Monthly`. This field will only be taken into consideration if the meeting type is `Meeting with fixed time`",
      optional: true,
    },
    recurrenceWeeklyDays: {
      type: "integer[]",
      label: "Weekly Days",
      description: "This field is required **if you are scheduling a weekly recurring meeting** to state which days(s) of the week the meeting should repeat. The value for this field could be a number between `1` and `7`. The number `1` means Sunday. You can choose more than one day per week. This field will only be taken into consideration if the meeting type is `Meeting with fixed time`",
      optional: true,
      options: daysOfTheWeek,
    },
    recurrenceMonthlyDay: {
      type: "integer",
      label: "Monthly Day",
      description: "Use this field **only if you are scheduling a monthly recurring meeting** to state which days(s) in a month, the meeting should recur. This field will only be taken into consideration if the meeting type is `Meeting with fixed time`",
      optional: true,
      min: 1,
      max: 31,
    },
    recurrenceMonthlyWeek: {
      type: "integer",
      label: "Monthly Week",
      description: "Use this field **only if you are scheduling a monthly recurring meeting** to state the week of the month when the meeting should recur. If you use this field **you must also use the `Monthly Week Day` field to state the day of the week when the meeting should recur**. This field will only be taken into consideration if the meeting type is `Meeting with fixed time`",
      optional: true,
      options: [
        {
          label: "Last week of the month.",
          value: -1,
        },
        {
          label: "First week of the month.",
          value: 1,
        },
        {
          label: "Second week of the month.",
          value: 2,
        },
        {
          label: "Third week of the month.",
          value: 3,
        },
        {
          label: "Fourth week of the month.",
          value: 4,
        },
      ],
    },
    recurrenceMonthlyWeekDay: {
      type: "integer",
      label: "Monthly Week Day",
      description: "Use this field **only if you are scheduling a monthly recurring meeting** to state a specific day in a week when the monthly meeting should recur. To use this field, you must also use the `Monthly Week` field. This field will only be taken into consideration if the meeting type is `Meeting with fixed time`",
      optional: true,
      options: daysOfTheWeek,
    },
    recurrenceEndTimes: {
      type: "integer",
      label: "End Times",
      description: "Select how many times the meeting should recur before it is canceled (Cannot be used with `End Date Time`). This field will only be taken into consideration if the meeting type is `Meeting with fixed time`",
      optional: true,
    },
    recurrenceEndDateTime: {
      type: "integer",
      label: "End Times",
      description: "Select the final date on which the meeting will recur before it is canceled. Should be in UTC time, such as `2017-11-25T12:00:00Z` (Cannot be used with `End Times`). This field will only be taken into consideration if the meeting type is `Meeting with fixed time`",
      optional: true,
    },
    settingsHostVideo: {
      type: "boolean",
      label: "(Settings) Host Video",
      description: "Whether to start meetings with the host video on.",
      optional: true,
    },
    settingsParticipantVideo: {
      type: "boolean",
      label: "(Settings) Participant Video",
      description: "Whether to start meetings with the participant video on.",
      optional: true,
    },
    settingsJoinBeforeHost: {
      type: "boolean",
      label: "(Settings) Join Before Host",
      description: "Whether participants can join the meeting before its host. The field is only used for scheduled meetings or recurring meetings. This value defaults to `false`. If the [Waiting Room feature](https://support.zoom.us/hc/en-us/articles/115000332726-Waiting-Room) is enabled, this setting is **disabled**",
      optional: true,
    },
    settingsJoinBeforeHostTime: {
      type: "integer",
      label: "(Settings) Join Before Host Time",
      description: "If the value of `Join Before Host` field is `true`, this field indicates the time limits within which a participant can join a meeting before the meeting's host.",
      optional: true,
      options: [
        {
          label: "Allow the participant to join the meeting anytime",
          value: 0,
        },
        {
          label: "Allow the participant to join 5 minutes before the meeting's start time",
          value: 5,
        },
        {
          label: "Allow the participant to join 5 minutes before the meeting's start time",
          value: 10,
        },
      ],
    },
    settingsMuteUponEntry: {
      type: "boolean",
      label: "(Settings) Mute Upon Entry",
      description: "Whether to mute participants upon entry",
      optional: true,
    },
    settingsWatermark: {
      type: "boolean",
      label: "(Settings) Watermark",
      description: "Whether to add a watermark when viewing a shared screen",
      optional: true,
    },
    settingsUsePMI: {
      type: "boolean",
      label: "(Settings) Use PMI (Personal Meeting ID)",
      description: "Whether to use a [PMI (Personal Meeting Id)](https://support.zoom.us/hc/en-us/articles/203276937-Using-Personal-Meeting-ID-PMI-) instead of a generated meeting ID. This field is only used for **Scheduled Meetings**, **Instant Meetings** or **Recurring Meetings with no fixed time**. This value defaults to `false`",
      optional: true,
    },
    settingsApprovalType: {
      type: "integer",
      label: "(Settings) Approval Type",
      description: "Enable meeting registration approval. Defaults to `No registration required`",
      optional: true,
      options: [
        {
          label: "Automatically approve registration.",
          value: 0,
        },
        {
          label: "Manually approve registration.",
          value: 1,
        },
        {
          label: "No registration required.",
          value: 2,
        },
      ],
    },
    settingsRegistrationType: {
      type: "integer",
      label: "(Settings) Registration Type",
      description: "The meeting's registration type. This field is only for **Recurring meetings with fixed times**. Defaults to `Attendees register once and can attend any meeting occurrence.`",
      optional: true,
      options: [
        {
          label: "Attendees register once and can attend any meeting occurrence.",
          value: 1,
        },
        {
          label: "Attendees must register for each meeting occurrence.",
          value: 2,
        },
        {
          label: "Attendees register once and can select one or more meeting occurrences to attend.",
          value: 3,
        },
      ],
    },
    settingsAudio: {
      type: "string",
      label: "(Settings) Audio",
      description: "How participants join the audio portion of the meeting. Defaults to `Both telephony and VoIP`",
      optional: true,
      options: [
        {
          label: "Both telephony and VoIP.",
          value: "both",
        },
        {
          label: "VoIP only.",
          value: "voip",
        },
        {
          label: "Telephony only.",
          value: "telephony",
        },
      ],
    },
    settingsAudioRecording: {
      type: "string",
      label: "(Settings) Audio Recording",
      description: "The automatic recording settings. Defaults to `Auto-recording disabled.`",
      optional: true,
      options: [
        {
          label: "Auto-recording disabled.",
          value: "none",
        },
        {
          label: "Record the meeting locally.",
          value: "local",
        },
        {
          label: "Record the meeting to the cloud.",
          value: "cloud",
        },
      ],
    },
    settingsAlternativeHosts: {
      type: "string[]",
      label: "(Settings) Alternative Hosts",
      description: "A semicolon-separated list of the meeting's alternative hosts' email addresses or IDs.",
      optional: true,
    },
    settingsCloseRegistration: {
      type: "boolean",
      label: "(Settings) Close Registration",
      description: "Whether to close the registration after the event date. Defaults to `false`",
      optional: true,
    },
    settingsWaitingRoom: {
      type: "boolean",
      label: "(Settings) Waiting Room",
      description: "Whether to enable the [Waiting Room feature](https://support.zoom.us/hc/en-us/articles/115000332726-Waiting-Room). If this value is `true`. this **disables** the `Join Before Host` setting",
      optional: true,
    },
    settingsContactName: {
      type: "string",
      label: "(Settings) Contact Name",
      description: "The contact name for meeting registration",
      optional: true,
    },
    settingsContactEmail: {
      type: "string",
      label: "(Settings) Contact Name",
      description: "The contact email for meeting registration",
      optional: true,
    },
    settingsRegistrantsEmailNotification: {
      type: "boolean",
      label: "(Settings) Registrants Email Notification",
      description: "Whether to send registrants email notifications about their registration approval, cancellation, or rejection. Defaults to `true`. Set this value to `true` to also use the `Registrants Confirmation Email` parameter",
      optional: true,
    },
    settingsRegistrantsConfirmationEmail: {
      type: "boolean",
      label: "(Settings) Registrants Confirmation Email",
      description: "Whether to send registrants an email confirmation",
      optional: true,
    },
    settingsMeetingAuthentication: {
      type: "boolean",
      label: "(Settings) Meeting Authentication Required",
      description: "If true, only [authenticated](https://support.zoom.us/hc/en-us/articles/360037117472-Authentication-Profiles-for-Meetings-and-Webinars) users can join the meeting",
      optional: true,
    },
    settingsShowShareButton: {
      type: "boolean",
      label: "(Settings) Show Share Button",
      description: "Whether to include social media sharing butons on the meeting’s registration page. This setting is only applied to meetings with registration enabled.",
      optional: true,
    },
    settingsAllowMultipleDevices: {
      type: "boolean",
      label: "(Settings) Allow Multiple Devices",
      description: "Whether to allow attendees to join a meeting from multiple devices. This setting is only applied to meetings with registration enabled.",
      optional: true,
    },
    rawSettings: {
      type: "object",
      label: "Raw Settings",
      description: "You can build your own setting object using this field. If this field is filled. All setting options will be ignored.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const MEETING_TYPE_RECURRING_MEETING_WITH_FIXED_NAME = 8;
    const data = {
      topic: this.topic,
      type: this.type,
      pre_schedule: this.preSchedule,
      start_time: this.startTime,
      duration: this.duration,
      schedule_for: this.scheduleFor,
      password: this.password,
      agenda: this.agenda,
      recurrence: (this.type === MEETING_TYPE_RECURRING_MEETING_WITH_FIXED_NAME
        ? {
          type: this.recurrenceType,
          repeat_interval: this.recurrenceRepeatInterval,
          weekly_days: isArray(this.recurrenceWeeklyDays)
            ? this.recurrenceWeeklyDays.join(",")
            : this.recurrenceWeeklyDays,
          monthly_day: this.recurrenceMonthlyDay,
          monthly_week: this.recurrenceMonthlyWeek,
          monthly_week_day: this.recurrenceMonthlyWeekDay,
          end_times: this.recurrenceEndTimes,
          end_date_time: this.recurrenceEndDateTime,
        }
        : null
      ),
      settings: this.rawSettings || {
        host_video: this.settingsHostVideo,
        participant_video: this.settingsParticipantVideo,
        join_before_host: this.settingsJoinBeforeHost,
        jbh_time: this.settingsJoinBeforeHostTime,
        mute_upon_entry: this.settingsMuteUponEntry,
        watermark: this.settingsWatermark,
        use_pmi: this.settingsUsePMI,
        approval_type: this.settingsApprovalType,
        registration_type: this.settingsRegistrationType,
        audio: this.settingsAudio,
        audio_recording: this.settingsAudioRecording,
        alternative_hosts: isArray(this.settingsAlternativeHosts)
          ? this.settingsAlternativeHosts.join(",")
          : this.settingsAlternativeHosts,
        close_registration: this.settingsCloseRegistration,
        waiting_room: this.settingsWaitingRoom,
        contact_name: this.settingsContactName,
        contact_email: this.settingsContactEmail,
        registrants_email_notification: this.settingsRegistrantsEmailNotification,
        registrants_confirmation_email: this.settingsRegistrantsConfirmationEmail,
        meeting_authentication: this.settingsMeetingAuthentication,
        show_share_button: this.settingsShowShareButton,
        allow_multiple_devices: this.settingsAllowMultipleDevices,
      },
    };
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "PATCH",
      path: `/meetings/${get(this.meeting, "value", this.meeting)}`,
      data,
    }));

    $.export("$summary", `The meeting "${this.topic}" was successfully updated`);

    return res;
  },
};

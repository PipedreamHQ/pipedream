import zoomAdmin from "../../zoom_admin.app.mjs";
import tzs from "../../zoom_tzs.mjs";
import zoomLangs from "../../zoom_languages.mjs";
import isArray from "lodash/isArray.js";
import consts from "../../consts.mjs";
import { axios } from "@pipedream/platform";

const {
  RECURRENCE_TYPE_OPTIONS,
  WEBINAR_TYPE_OPTIONS,
  RECURRENCE_MONTHLY_WEEK_OPTIONS,
  SETTINGS_APPROVAL_TYPE_OPTIONS,
  REGISTRATION_TYPE_OPTIONS,
  SETTINGS_AUDIO_OPTIONS,
  SETTINGS_AUDIO_RECORDING_OPTIONS,
  DAYS_OF_THE_WEEK_OPTIONS,
} = consts;

export default {
  name: "Create Webinar",
  description: "Create a webinar for an user. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarcreate)",
  key: "zoom_admin-action-create-a-webinar",
  version: "0.0.1",
  type: "action",
  props: {
    zoomAdmin,
    topic: {
      type: "string",
      label: "Name",
      description: "The Webinar's topic.",
      optional: true,
    },
    recurrenceType: {
      type: "integer",
      label: "Recurrence Type",
      description: "Recurrence webinar types",
      options: RECURRENCE_TYPE_OPTIONS,
    },
    // type: {
    //   type: "integer",
    //   label: "Type",
    //   description: "Defaults to `Webinar`. The type of the webinar",
    //   options: WEBINAR_TYPE_OPTIONS,
    //   default: 5,
    //   optional: true,
    // },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The webinar start time. We support two formats for this field - local time and GMT. To set time as GMT the format should be `yyyy-MM-ddTHH:mm:ssZ`. To set time using a specific timezone, use `yyyy-MM-ddTHH:mm:ss` format and specify the timezone ID in the `timezone` field.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The webinar’s duration, in minutes. This field is only used for scheduled webinars.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezome to assign to the `startTime`. This field is only used for scheduled webinars.",
      options: tzs,
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password required to join the webinar. By default, a password can only have a maximum length of `10` characters and only contain alphanumeric characters and the `@`, `-`, `_` and `*` characters.",
      optional: true,
    },
    // agenda: {
    //   type: "string",
    //   label: "Agenda",
    //   description: "Webinar agenda",
    //   optional: true,
    // },
    // recurrenceRepeatInterval: {
    //   type: "integer",
    //   label: "Repeat Interval",
    //   description: "Define the interval at which the webinar should recur. For instance, if you would like to schedule a Webinar that recurs every two months, you must set the value of this field as `2`and the value of `type`parameter as `Monthly`",
    //   optional: true,
    // },
    // recurrenceWeeklyDays: {
    //   type: "integer[]",
    //   label: "Weekly Days",
    //   description: "Use this field **only if you're scheduling a recurring webinar with `type=Weekly`** to state which day(s) of the week the webinar should repeat. The value for this field could be a number between `1` and `7`. `1` means **Sunday** and `7` means **Saturday**",
    //   optional: true,
    //   options: DAYS_OF_THE_WEEK_OPTIONS,
    // },
    // recurrenceMonthlyDay: {
    //   type: "integer",
    //   label: "Monthly Day",
    //   description: "Use this field **only if you're scheduling a recurring webinar with `type=Monthly`** to state which day in a month, the webinar should recur.",
    //   optional: true,
    //   min: 1,
    //   max: 31,
    // },
    // recurrenceMonthlyWeek: {
    //   type: "integer",
    //   label: "Monthly Week",
    //   description: "Use this field **only if you are scheduling a recurring webinar with `type=Monthly`** to state the week of the month when the webinar should recur. If you use this field **you must also use the `Monthly Week Day` field to state the day of the week when the meeting should recur**.",
    //   optional: true,
    //   options: RECURRENCE_MONTHLY_WEEK_OPTIONS,
    // },
    // recurrenceMonthlyWeekDay: {
    //   type: "integer",
    //   label: "Monthly Week Day",
    //   description: "Use this field **only if you are scheduling a monthly recurring webinar** to state a specific day in a week when the monthly meeting should recur. To use this field, you must also use the `Monthly Week` field.",
    //   optional: true,
    //   options: DAYS_OF_THE_WEEK_OPTIONS,
    // },
    // recurrenceEndTimes: {
    //   type: "integer",
    //   label: "End Times",
    //   description: "Select how many times the webinar should recur before it is canceled (Cannot be used with `End Date Time`).",
    //   optional: true,
    // },
    // recurrenceEndDateTime: {
    //   type: "integer",
    //   label: "End Times",
    //   description: "Select the final date on which the webinar will recur before it is canceled. Should be in UTC time, such as `2017-11-25T12:00:00Z` (Cannot be used with `End Times`).",
    //   optional: true,
    // },
    // settingsHostVideo: {
    //   type: "boolean",
    //   label: "(Settings) Host Video",
    //   description: "Whether to start meetings with the host video on.",
    //   optional: true,
    // },
    // settingsPanelistsVideo: {
    //   type: "boolean",
    //   label: "(Settings) Panelists Video",
    //   description: "Start video when panelists join webinar.",
    //   optional: true,
    // },
    // settingsPracticeSession: {
    //   type: "boolean",
    //   label: "(Settings) Panelists Video",
    //   description: "Enable practice session.",
    //   optional: true,
    // },
    // settingsParticipantVideo: {
    //   type: "boolean",
    //   label: "(Settings) Participant Video",
    //   description: "Whether to start meetings with the participant video on.",
    //   optional: true,
    // },
    // settingsHdVideo: {
    //   type: "boolean",
    //   label: "(Settings) HD Video",
    //   description: "Default to HD video.",
    //   optional: true,
    // },
    // settingsHdVideoForAttendees: {
    //   type: "boolean",
    //   label: "(Settings) HD Video for Attendees",
    //   description: "Whether HD video for attendees is enabled. Defaults to `false`.",
    //   optional: true,
    // },
    // settingsSend1080pVideoToAttendees: {
    //   type: "boolean",
    //   label: "(Settings) Send 1080p Video for Attendees",
    //   description: "Whether to always send 1080p videos to attendees. Defaults to `false`.",
    //   optional: true,
    // },
    // settingsApprovalType: {
    //   type: "integer",
    //   label: "(Settings) Approval Type",
    //   description: "Enable meeting registration approval. Defaults to `No registration required`",
    //   optional: true,
    //   options: SETTINGS_APPROVAL_TYPE_OPTIONS,
    // },
    // settingsRegistrationType: {
    //   type: "integer",
    //   label: "(Settings) Registration Type",
    //   description: "The meeting's registration type. This field is only for **Recurring meetings with fixed times**. Defaults to `Attendees register once and can attend any meeting occurrence.`",
    //   optional: true,
    //   options: REGISTRATION_TYPE_OPTIONS,
    // },
    // settingsAudio: {
    //   type: "string",
    //   label: "(Settings) Audio",
    //   description: "How participants join the audio portion of the meeting. Defaults to `Both telephony and VoIP`",
    //   optional: true,
    //   options: SETTINGS_AUDIO_OPTIONS,
    // },
    // settingsAudioRecording: {
    //   type: "string",
    //   label: "(Settings) Audio Recording",
    //   description: "The automatic recording settings. Defaults to `Auto-recording disabled.`",
    //   optional: true,
    //   options: SETTINGS_AUDIO_RECORDING_OPTIONS,
    // },
    // settingsAlternativeHosts: {
    //   type: "string[]",
    //   label: "(Settings) Alternative Hosts",
    //   description: "A semicolon-separated list of the meeting's alternative hosts' email addresses or IDs.",
    //   optional: true,
    // },
    // settingsCloseRegistration: {
    //   type: "boolean",
    //   label: "(Settings) Close Registration",
    //   description: "Whether to close the registration after the event date. Defaults to `false`",
    //   optional: true,
    // },
    // settingsOnDemand: {
    //   type: "string",
    //   label: "(Settings) On Demand",
    //   description: "Make this webinar on-demand",
    //   optional: true,
    // },
    // settingsContactName: {
    //   type: "string",
    //   label: "(Settings) Contact Name",
    //   description: "The contact name for meeting registration",
    //   optional: true,
    // },
    // settingsContactEmail: {
    //   type: "string",
    //   label: "(Settings) Contact Name",
    //   description: "The contact email for meeting registration",
    //   optional: true,
    // },
    // settingsRegistrantsEmailNotification: {
    //   type: "boolean",
    //   label: "(Settings) Registrants Email Notification",
    //   description: "Whether to send registrants email notifications about their registration approval, cancellation, or rejection. Defaults to `true`. Set this value to `true` to also use the `Registrants Confirmation Email` parameter",
    //   optional: true,
    // },
    // settingsMeetingAuthentication: {
    //   type: "boolean",
    //   label: "(Settings) Meeting Authentication Required",
    //   description: "If true, only [authenticated](https://support.zoom.us/hc/en-us/articles/360037117472-Authentication-Profiles-for-Meetings-and-Webinars) users can join the meeting",
    //   optional: true,
    // },
    // settingsShowShareButton: {
    //   type: "boolean",
    //   label: "(Settings) Show Share Button",
    //   description: "Whether to include social media sharing buttons on the meeting’s registration page. This setting is only applied to meetings with registration enabled.",
    //   optional: true,
    // },
    // settingsAllowMultipleDevices: {
    //   type: "boolean",
    //   label: "(Settings) Allow Multiple Devices",
    //   description: "Whether to allow attendees to join a meeting from multiple devices. This setting is only applied to meetings with registration enabled.",
    //   optional: true,
    // },
    // settingsRegistrantsRestrictNumber: {
    //   type: "integer",
    //   label: "(Settings) Registrants Restrict Number",
    //   description: "Restrict number of registrants for a webinar. By default, it is set to `0`. A `0`value means that the restriction is disabled.",
    //   optional: true,
    //   min: 0,
    //   max: 20000,
    // },
    // settingsPostWebinarSurvey: {
    //   type: "boolean",
    //   label: "(Settings) Post Webinar Survey",
    //   description: "Zoom will open a survey page in attendees' browsers after leaving the webinar.",
    //   optional: true,
    // },
    // settingsSurveyUrl: {
    //   type: "string",
    //   label: "(Settings) Survey URL",
    //   description: "Survey URL for post webinar survey.",
    //   optional: true,
    // },
    // settingsEmailLanguage: {
    //   type: "string",
    //   label: "(Settings) Email Language",
    //   description: "The email language.",
    //   optional: true,
    //   options: zoomLangs,
    // },
    // settingsPanelistsInvitationEmailNotification: {
    //   type: "boolean",
    //   label: "(Settings) Panelists Invitation Email Notification",
    //   description: "Whether Zoom should send an notification email to the panelists.",
    //   optional: true,
    // },
    // rawSettings: {
    //   type: "object",
    //   label: "Raw Settings",
    //   description: "You can build your own setting object using this field. If this field is filled. All setting options will be ignored.",
    //   optional: true,
    // },
  },
  async run ({ $ }) {
    const data = {
      topic: this.topic,
      type: this.type,
      start_time: this.startTime,
      duration: this.duration,
      password: this.password,
      agenda: this.agenda,
      recurrence: {
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
      },
      settings: this.rawSettings || {
        host_video: this.settingsHostVideo,
        panelists_video: this.settingsPanelistsVideo,
        practice_session: this.settingsPracticeSession,
        hd_video: this.settingsHdVideo,
        hd_video_for_attendees: this.settingsHdVideoForAttendees,
        send_1080p_video_to_attendees: this.settingsSend1080pVideoToAttendees,
        approval_type: this.settingsApprovalType,
        registration_type: this.settingsRegistrationType,
        audio: this.settingsAudio,
        audio_recording: this.settingsAudioRecording,
        alternative_hosts: isArray(this.settingsAlternativeHosts)
          ? this.settingsAlternativeHosts.join(",")
          : this.settingsAlternativeHosts,
        close_registration: this.settingsCloseRegistration,
        on_demand: this.settingsOnDemand,
        contact_name: this.settingsContactName,
        contact_email: this.settingsContactEmail,
        registrants_email_notification: this.settingsRegistrantsEmailNotification,
        meeting_authentication: this.settingsMeetingAuthentication,
        show_share_button: this.settingsShowShareButton,
        allow_multiple_devices: this.settingsAllowMultipleDevices,
        registrants_restrict_number: this.settingsRegistrantsRestrictNumber,
        post_webinar_survey: this.settingsPostWebinarSurvey,
        survey_url: this.settingsSurveyUrl,
        email_language: this.settingsEmailLanguage,
        panelists_invitation_email_notification: this.settingsPanelistsInvitationEmailNotification,
      },
    };
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "POST",
      path: "/users/me/webinars",
      data,
    }));

    $.export("$summary", `The webinar, "${this.topic}," was successfully created`);

    return res;
  },
};

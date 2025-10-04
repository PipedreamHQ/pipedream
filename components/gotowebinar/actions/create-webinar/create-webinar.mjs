import gotowebinar from "../../gotowebinar.app.mjs";

export default {
  key: "gotowebinar-create-webinar",
  name: "Create Webinar",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a single session webinar, a sequence of webinars or a series of webinars depending on the type field in the body. [See the documentation](https://developer.goto.com/GoToWebinarV2/#operation/createWebinar)",
  type: "action",
  props: {
    gotowebinar,
    organizerKey: {
      propDefinition: [
        gotowebinar,
        "organizerKey",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The name/subject of the webinar.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A short description of the webinar.",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time zone where the webinar is taking place (must be a valid time zone ID). If this parameter is not passed, the timezone of the organizer's profile will be used. [See the list of TimeZones](https://www.ibm.com/docs/en/was/9.0.5?topic=ctzs-time-zone-ids-that-can-be-specified-usertimezone-property)",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Specifies the webinar type.",
      options: [
        "single_session",
        "series",
        "sequence",
      ],
      default: "single_session",
      reloadProps: true,
    },
    isPasswordProtected: {
      type: "boolean",
      label: "Is Password Protected",
      description: "A boolean flag indicating if the webinar is password protected or not. Default is `false`.",
      optional: true,
    },
    recordingAssetKey: {
      type: "string",
      label: "Recording Asset Key",
      description: "The recording asset with which the simulive webinar should be created from. In case the recordingasset was created as an online recording the simulive webinar settings, poll and surveys would be copied from the webinar whose session was recorded.",
      optional: true,
    },
    isOndemand: {
      type: "boolean",
      label: "Is Ondemand",
      description: "A boolean flag indicating if the webinar should be ondemand. Default is `false`.",
      optional: true,
    },
    experienceType: {
      type: "string",
      label: "Experience Type",
      description: "Specifies the experience type. Default is `CLASSIC`",
      options: [
        "CLASSIC",
        "BROADCAST",
        "SIMULIVE",
      ],
      optional: true,
    },
    confirmationEmail: {
      type: "boolean",
      label: "Confirmation Email",
      description: "Set whether the confirmation email is sent or not.",
      optional: true,
    },
    reminderEmail: {
      type: "boolean",
      label: "Reminder Email",
      description: "Set whether the reminder email is sent or not.",
      optional: true,
    },
    absenteeFollowUpEmail: {
      type: "boolean",
      label: "Absentee Follow-up Email",
      description: "Set whether the absentee follow-up email is sent or not.",
      optional: true,
    },
    attendeeFollowUpEmail: {
      type: "boolean",
      label: "Attendee Follow-up Email",
      description: "Set whether the attendee follow-up email is sent or not.",
      optional: true,
    },
    attendeeIncludeCertificate: {
      type: "boolean",
      label: "Attendee Include Certificate",
      description: "Indicates whether to include certificates in attendee follow-up emails is enabled or disabled.",
      optional: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (this.type) {
      switch (this.type) {
      case "series":
        props.numberOfTimeframes = {
          type: "integer",
          label: "Number of Timeframes",
          description: "The quantity of timeframes you want to create.",
          min: 2,
          reloadProps: true,
        };
        break;

      case "sequence":
        this.numberOfTimeframes = 0;
        props.recurrenceEnd = {
          type: "string",
          label: "Recurrence End",
          description: "When the webinar sequence ends, e.g. `2020-03-13`.",
        };
        props.recurrencePattern = {
          type: "string",
          label: "Recurrence Pattern",
          description: "The frequence of the webinar.",
          options: [
            "daily",
            "weekly",
            "monthly",
          ],
        };
        props.startTime = {
          type: "string",
          label: "Start Time",
          description: "The starting time of an interval, e.g. `2020-03-13T10:00:00Z`.",
        };
        props.endTime = {
          type: "string",
          label: "End Time",
          description: "The ending time of an interval, e.g. `2020-03-13T10:00:00Z`.",
        };
        break;

      default:
        this.numberOfTimeframes = 0;
        props.startTime = {
          type: "string",
          label: "Start Time",
          description: "The starting time of an interval, e.g. `2020-03-13T10:00:00Z`.",
        };
        props.endTime = {
          type: "string",
          label: "End Time",
          description: "The ending time of an interval, e.g. `2020-03-13T10:00:00Z`.",
        };
        break;
      }
    }
    if (this.numberOfTimeframes) {
      props = {
        ...props,
        ...Array.from({
          length: this.numberOfTimeframes,
        }).reduce((acc, _, index) => {
          const pos = index + 1;

          return {
            ...acc,
            [`startTime-${pos}`]: {
              type: "string",
              label: `Start Time ${pos}`,
              description: "The starting time of an interval, e.g. `2020-03-13T10:00:00Z`.",
            },
            [`endTime-${pos}`]: {
              type: "string",
              label: `End Time ${pos}`,
              description: "The ending time of an interval, e.g. `2020-03-13T10:00:00Z`.",
            },
          };
        }, {}),
      };
    }
    return props;
  },
  methods: {
    getTime(index) {
      const pos = index + 1;
      const {
        [`startTime-${pos}`]: startTime,
        [`endTime-${pos}`]: endTime,
      } = this;
      return {
        startTime,
        endTime,
      };
    },
    getTimes(numberOfTimeframes) {
      return Array.from({
        length: numberOfTimeframes,
      }).map((_, index) => this.getTime(index));
    },
  },
  async run({ $ }) {
    const {
      gotowebinar,
      organizerKey,
      subject,
      description,
      timeZone,
      type,
      numberOfTimeframes,
      startTime,
      endTime,
      recurrenceEnd,
      recurrencePattern,
      isPasswordProtected,
      recordingAssetKey,
      isOndemand,
      experienceType,
      confirmationEmail,
      reminderEmail,
      absenteeFollowUpEmail,
      attendeeFollowUpEmail,
      attendeeIncludeCertificate,
    } = this;

    const obj = {};

    switch (type) {
    case "series":
      obj.times = this.getTimes(numberOfTimeframes);
      break;
    case "sequence":
      obj.recurrenceStart = {
        startTime,
        endTime,
      };
      obj.recurrenceEnd = recurrenceEnd;
      obj.recurrencePattern = recurrencePattern;
      break;
    default:
      obj.times = [
        {
          startTime,
          endTime,
        },
      ];
      break;
    }

    const response = await gotowebinar.createWebinar({
      $,
      organizerKey,
      data: {
        subject,
        description,
        timeZone,
        type,
        isPasswordProtected,
        recordingAssetKey,
        isOndemand,
        experienceType,
        emailSettings: {
          confirmationEmail: {
            enabled: confirmationEmail,
          },
          reminderEmail: {
            enabled: reminderEmail,
          },
          absenteeFollowUpEmail: {
            enabled: absenteeFollowUpEmail,
          },
          attendeeFollowUpEmail: {
            enabled: attendeeFollowUpEmail,
            includeCertificate: attendeeIncludeCertificate,
          },
        },
        ...obj,
      },
    });

    $.export("$summary", `A new webinar with key: ${response.webinarKey} was successfully created!`);
    return response;
  },
};

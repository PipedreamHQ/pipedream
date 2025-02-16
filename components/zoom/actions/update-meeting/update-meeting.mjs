import zoom from "../../zoom.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-update-meeting",
  name: "Update Meeting",
  description: "Updates an existing Zoom meeting. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/PATCH/meetings/{meetingId})",
  version: "0.1.5",
  type: "action",
  props: {
    zoom,
    meetingId: {
      propDefinition: [
        zoom,
        "meetingId",
      ],
      description: "The Zoom Meeting ID of the meeting you'd like to update.",
    },
    topic: {
      propDefinition: [
        zoom,
        "topic",
      ],
    },
    type: {
      propDefinition: [
        zoom,
        "type",
      ],
    },
    startTime: {
      propDefinition: [
        zoom,
        "startTime",
      ],
    },
    duration: {
      propDefinition: [
        zoom,
        "duration",
      ],
    },
    timezone: {
      propDefinition: [
        zoom,
        "timezone",
      ],
    },
    password: {
      propDefinition: [
        zoom,
        "password",
      ],
    },
    agenda: {
      propDefinition: [
        zoom,
        "agenda",
      ],
    },
    trackingFields: {
      propDefinition: [
        zoom,
        "trackingFields",
      ],
    },
    recurrence: {
      propDefinition: [
        zoom,
        "recurrence",
      ],
    },
    settings: {
      propDefinition: [
        zoom,
        "settings",
      ],
    },
  },
  methods: {
    updateMeeting({
      meetingId, ...args
    }) {
      return this.zoom.update({
        path: `/meetings/${meetingId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.updateMeeting({
      $,
      meetingId: this.meetingId,
      data: {
        topic: this.topic,
        type: this.type,
        start_time: this.startTime,
        duration: this.duration,
        timezone: this.timezone,
        password: this.password,
        agenda: this.agenda,
        tracking_fields: utils.parseObj(this.trackingFields),
        recurrence: utils.parseObj(this.recurrence),
        settings: utils.parseObj(this.settings),
      },
    });
    $.export("$summary", `Successfully updated meeting with ID \`${this.meetingId}\``);
    return response;
  },
};

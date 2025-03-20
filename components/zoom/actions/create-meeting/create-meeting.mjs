import zoom from "../../zoom.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-create-meeting",
  name: "Create Meeting",
  description: "Creates a meeting for a user. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings)",
  version: "0.1.5",
  type: "action",
  props: {
    zoom,
    userId: {
      propDefinition: [
        zoom,
        "userId",
      ],
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
    createMeeting({
      userId, ...args
    }) {
      return this.zoom.create({
        path: `/users/${userId}/meetings`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.createMeeting({
      $,
      userId: this.userId,
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
    $.export("$summary", `Successfully created meeting with ID \`${response.id}\``);
    return response;
  },
};

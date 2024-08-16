import utils from "../../common/utils.mjs";
import app from "../../welcome.app.mjs";

export default {
  key: "welcome-update-event",
  name: "Update an Existing Event",
  description: "Updates an existing event. [See the documentation](https://app.experiencewelcome.com/api-docs/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    eventId: {
      propDefinition: [
        app,
        "eventId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
      optional: true,
    },
    startTime: {
      propDefinition: [
        app,
        "startTime",
      ],
      optional: true,
    },
    endTime: {
      propDefinition: [
        app,
        "endTime",
      ],
      optional: true,
    },
    timeZone: {
      propDefinition: [
        app,
        "timeZone",
      ],
      optional: true,
    },
    data: {
      propDefinition: [
        app,
        "data",
      ],
      optional: true,
    },
  },
  methods: {
    updateEvent({
      eventId, ...args
    } = {}) {
      return this.app.patch({
        path: `/events/${eventId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateEvent,
      eventId,
      name,
      description,
      startTime,
      endTime,
      timeZone,
      data,
    } = this;

    const response = await updateEvent({
      $,
      eventId,
      data: {
        event: {
          ...utils.parseJson(data),
          name,
          description,
          startTime,
          endTime,
          timeZone,
        },
      },
    });

    $.export("$summary", `Successfully updated event with ID ${this.eventId}`);
    return response;
  },
};

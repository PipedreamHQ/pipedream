import app from "../../welcome.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "welcome-create-event",
  name: "Create New Event",
  description: "Creates a new event. [See the documentation](https://app.experiencewelcome.com/api-docs/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    startTime: {
      propDefinition: [
        app,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        app,
        "endTime",
      ],
    },
    timeZone: {
      propDefinition: [
        app,
        "timeZone",
      ],
    },
    data: {
      propDefinition: [
        app,
        "data",
      ],
    },
  },
  methods: {
    createEvent(args = {}) {
      return this.app.post({
        path: "/events",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createEvent,
      name,
      description,
      startTime,
      endTime,
      timeZone,
      data,
    } = this;

    const response = await createEvent({
      $,
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
    $.export("$summary", `Successfully created a new event: ${name}`);
    return response;
  },
};

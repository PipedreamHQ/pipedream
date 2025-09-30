import app from "../../webinarfuel.app.mjs";

export default {
  key: "webinarfuel-add-new-registrant",
  name: "Add New Registrant",
  description: "Creates a new registrant for a selected webinar. [See the documentation](https://webinarfuel.docs.apiary.io/#/reference/registrant/registrants-collection/create-registrant/200?mc=reference%2Fregistrant%2Fregistrants-collection%2Fcreate-registrant%2F200)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    webinarId: {
      propDefinition: [
        app,
        "webinarId",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    tags: {
      optional: true,
      propDefinition: [
        app,
        "tags",
      ],
    },
    webinarSessionId: {
      propDefinition: [
        app,
        "webinarSessionId",
        ({ webinarId }) => ({
          webinarId,
        }),
      ],
    },
    timeZone: {
      optional: true,
      propDefinition: [
        app,
        "timeZone",
      ],
    },
  },
  methods: {
    createRegistrant(args = {}) {
      return this.app.post({
        path: "/registrants",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      createRegistrant,
      webinarId,
      email,
      firstName,
      tags,
      webinarSessionId,
      timeZone,
    } = this;

    return createRegistrant({
      step,
      data: {
        webinar_id: webinarId,
        registrant: {
          email,
          first_name: firstName,
          tags,
        },
        session: {
          webinar_session_id: webinarSessionId,
          timezone: timeZone,
        },
      },
      summary: (response) => `Successfully added new registrant with email: ${response.email}`,
    });
  },
};

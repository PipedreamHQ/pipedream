import app from "../../webinarkit.app.mjs";

export default {
  key: "webinarkit-register-attendee",
  name: "Register Attendee",
  description: "Registers a new attendee for a specific webinar. [See the documentation](https://documenter.getpostman.com/view/22597176/Uzs435mo#4eb04d17-042d-4026-8b2d-bc972f442ae0)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    webinarId: {
      propDefinition: [
        app,
        "webinarId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the attendee.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the attendee.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the attendee.",
    },
    date: {
      propDefinition: [
        app,
        "webinarDate",
        ({ webinarId }) => ({
          webinarId,
        }),
      ],
    },
  },
  methods: {
    registerAttendee({
      webinarId, ...args
    } = {}) {
      return this.app.post({
        path: `/webinar/registration/${webinarId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      registerAttendee,
      webinarId,
      ...data
    } = this;

    const response = await registerAttendee({
      step,
      webinarId,
      data,
    });

    if (response.status !== "OK") {
      throw new Error(`Unexpected response: ${JSON.stringify(response)}`);
    }

    step.export("$summary", `Successfully registered attendee with registration date ${response.registrationDate}.`);

    return response;
  },
};

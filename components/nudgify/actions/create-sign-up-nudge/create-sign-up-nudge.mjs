import app from "../../nudgify.app.mjs";

export default {
  key: "nudgify-create-sign-up-nudge",
  name: "Create Sign-up Nudge",
  description:
    "Creates a sign-up nudge for a user in Nudgify. [See docs here](https://www.nudgify.com/docs/knowledge-base/rest-api-for-sign-ups)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    date: {
      propDefinition: [
        app,
        "date",
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
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    ip: {
      propDefinition: [
        app,
        "ip",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const {
      date, email, firstName, lastName, ip, city, state, country,
    } = this;
    const data = {
      conversions: [
        {
          date,
          email,
          first_name: firstName,
          last_name: lastName,
          ip,
          city,
          state,
          country,
        },
      ],
    };

    const response = await this.app.createSignUpNudge({
      $,
      data,
    });
    $.export("$summary", "Successfully created sign-up nudge");
    return response;
  },
};

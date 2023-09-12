import app from "../../nudgify.app.mjs";

export default {
  key: "nudgify-create-signup-nudge",
  name: "Create Sign-up Nudge",
  description:
    "Creates a sign-up nudge for a user in Nudgify. [See docs here](https://www.nudgify.com/docs/knowledge-base/rest-api-for-sign-ups)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    date: {
      type: "string",
      label: "Date",
      description:
        "The date (UTC) used to show in the Nudge how long ago the conversion took place. Format: `YYYY-MM-DD HH:MM:SS` (example: `2021-04-15 04:29:42`)",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user",
      optional: true,
    },
    ip: {
      type: "string",
      label: "IP Address",
      description: "The IP address of the user",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the user",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the user",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description:
        "The country of the user (max 2 characters, e.g. `GB`, `US`)",
      optional: true,
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

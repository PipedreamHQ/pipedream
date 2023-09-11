import { axios } from "@pipedream/platform";
import app from "../../nudgify.app.mjs";

export default {
  key: "nudgify-create-signup-nudge",
  name: "Create Sign-up Nudge",
  description: "Creates a sign-up nudge for a user in Nudgify. [See docs here](https://www.nudgify.com/docs/knowledge-base/rest-api-for-sign-ups)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    siteKey: {
      type: "string",
      label: "Site Key",
      description: "The site key associated with your Nudgify account",
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
      description: "The country of the user",
      optional: true,
    },
  },
  methods: {
    async createSignupNudge({
      $, data,
    }) {
      return await axios($, {
        method: "POST",
        url: "https://app.nudgify.com/api/conversions",
        headers: {
          "Authorization": `Bearer ${this.nudgify.$auth.api_key}`,
          "content-type": "application/json",
          "accept": "application/json",
        },
        data,
      });
    },
  },
  async run({ $ }) {
    const data = {
      "site_key": this.siteKey,
      "conversions": [
        {
          "email": this.email,
          "first_name": this.firstName,
          "last_name": this.lastName,
          "ip": this.ip,
          "city": this.city,
          "state": this.state,
          "country": this.country,
        },
      ],
    };

    const response = await this.createSignupNudge({
      $,
      data,
    });
    $.export("$summary", "Successfully created sign-up nudge");
    return response.data;
  },
};

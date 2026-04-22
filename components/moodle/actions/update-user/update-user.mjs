import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-update-user",
  name: "Update a User",
  description: "Updates an existing user's details such as name, email, password, or department. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    userId: {
      propDefinition: [
        moodle,
        "userId",
      ],
    },
    password: {
      type: "string",
      label: "Password",
      description: "The updated password",
      secret: true,
      optional: true,
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The updated first name",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The updated last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The updated email address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The updated city",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The updated two-letter country code (e.g. `US`, `GB`)",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "The updated department",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "The updated preferred language code (e.g. `en`, `fr`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      "users[0][id]": this.userId,
    };
    if (this.password !== undefined) params["users[0][password]"] = this.password;
    if (this.firstname !== undefined) params["users[0][firstname]"] = this.firstname;
    if (this.lastname !== undefined) params["users[0][lastname]"] = this.lastname;
    if (this.email !== undefined) params["users[0][email]"] = this.email;
    if (this.city !== undefined) params["users[0][city]"] = this.city;
    if (this.country !== undefined) params["users[0][country]"] = this.country;
    if (this.department !== undefined) params["users[0][department]"] = this.department;
    if (this.lang !== undefined) params["users[0][lang]"] = this.lang;

    const response = await this.moodle.updateUsers({
      $,
      params,
    });
    $.export("$summary", `Successfully updated user ${this.userId}`);
    return response;
  },
};

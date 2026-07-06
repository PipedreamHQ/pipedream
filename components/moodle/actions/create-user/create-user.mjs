import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-create-user",
  name: "Create a User",
  description: "Creates a new user in Moodle. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    username: {
      type: "string",
      label: "Username",
      description: "The username for the new user (must be unique and lowercase)",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the new user",
      secret: true,
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The first name of the user",
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user",
    },
    idnumber: {
      type: "string",
      label: "ID Number",
      description: "An optional external ID number for the user",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the user",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The two-letter country code (e.g. `US`, `GB`)",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "The department the user belongs to",
      optional: true,
    },
    phone1: {
      type: "string",
      label: "Phone",
      description: "The primary phone number of the user",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "The preferred language code for the user (e.g. `en`, `fr`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.moodle.createUsers({
      $,
      params: {
        "users[0][username]": this.username,
        "users[0][password]": this.password,
        "users[0][firstname]": this.firstname,
        "users[0][lastname]": this.lastname,
        "users[0][email]": this.email,
        "users[0][idnumber]": this.idNumber,
        "users[0][city]": this.city,
        "users[0][country]": this.country,
        "users[0][department]": this.department,
        "users[0][phone1]": this.phone1,
        "users[0][lang]": this.lang,
      },
    });
    $.export("$summary", `Successfully created user "${this.username}"`);
    return response;
  },
};

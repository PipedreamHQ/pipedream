import dolibarr from "../../dolibarr.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "dolibarr-create-user",
  name: "Create User",
  description: "Create a new user in Dolibarr.",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dolibarr,
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
    },
    login: {
      type: "string",
      label: "Login",
      description: "The login name of the user. Must be unique.",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user",
      optional: true,
    },
    officePhone: {
      type: "string",
      label: "Office Phone",
      description: "The office phone number of the user",
      optional: true,
    },
    jobPosition: {
      type: "string",
      label: "Job Position",
      description: "The job position of the user",
      optional: true,
    },
    isAdmin: {
      type: "boolean",
      label: "Is Admin",
      description: "Whether the user is an administrator",
      optional: true,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "The street address of the user",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the user",
      optional: true,
    },
    town: {
      type: "string",
      label: "Town",
      description: "The city or town of the user",
      optional: true,
    },
    additionalProperties: {
      propDefinition: [
        dolibarr,
        "additionalProperties",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dolibarr.createUser({
      $,
      data: {
        firstname: this.firstName,
        lastname: this.lastName,
        login: this.login,
        password: this.password,
        email: this.email,
        office_phone: this.officePhone,
        job: this.jobPosition,
        admin: this.isAdmin
          ? 1
          : 0,
        address: this.streetAddress,
        zip: this.zip,
        town: this.town,
        ...parseObject(this.additionalProperties),
      },
    });
    $.export("$summary", `Successfully created user ${response}`);
    return response;
  },
};

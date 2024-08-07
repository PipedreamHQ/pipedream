import connecteam from "../../connecteam.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "connecteam-create-user",
  name: "Create User",
  description: "Creates a new user profile in Connecteam. [See the documentation](https://developer.connecteam.com/reference/create_users_users_v1_users_post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    connecteam,
    firstname: {
      type: "string",
      label: "First Name",
      description: "The user's first name",
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The user's last name",
    },
    phonenumber: {
      type: "string",
      label: "Phone Number",
      description: "The user's phone number",
    },
    usertype: {
      propDefinition: [
        connecteam,
        "userType",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email (mandatory for managers and owners)",
      optional: true,
    },
    customfields: {
      type: "string[]",
      label: "Custom Fields",
      description: "An array of objects representing the user's custom fields",
      optional: true,
    },
    isarchived: {
      type: "boolean",
      label: "Is Archived",
      description: "The user's archived status",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const data = {
      firstName: this.firstname,
      lastName: this.lastname,
      phoneNumber: this.phonenumber,
      userType: this.usertype,
      email: this.email,
      customFields: this.customfields
        ? this.customfields.map(JSON.parse)
        : undefined,
      isArchived: this.isarchived,
    };

    if ((this.usertype === "manager" || this.usertype === "owner") && !this.email) {
      throw new Error("Email is mandatory for managers and owners.");
    }

    const response = await this.connecteam.createUser(data);
    $.export("$summary", `Successfully created user ${response.firstName} ${response.lastName}`);
    return response;
  },
};

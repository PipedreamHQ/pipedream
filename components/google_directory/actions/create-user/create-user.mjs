import googleDirectory from "../../google_directory.app.mjs";

export default {
  key: "google_directory-create-user",
  name: "Create User",
  description: "Creates a new user. [See the documentation](https://developers.google.com/admin-sdk/directory/reference/rest/v1/users/insert)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDirectory,
    email: {
      type: "string",
      label: "Email",
      description: "The user's primary email address. The email domain name must be a domain associated with the account.",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the user account",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for the user",
      optional: true,
    },
  },
  async run({ $ }) {
    await this.googleDirectory.verifyEmail({
      email: this.email,
      $,
    });

    const data = {
      primaryEmail: this.email,
      password: this.password,
      name: {
        givenName: this.firstName,
        familyName: this.lastName,
      },
    };

    if (this.phone) {
      data.phone = {
        value: this.phone,
      };
    }

    if (this.notes) {
      data.notes = {
        contentType: "text_plain",
        value: this.notes,
      };
    }

    const response = await this.googleDirectory.createUser({
      data,
      $,
    });

    $.export("$summary", `Successfully created user with ID ${response.id}.`);

    return response;
  },
};

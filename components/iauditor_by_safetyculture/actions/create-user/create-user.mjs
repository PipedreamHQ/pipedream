import safetyculture from "../../iauditor_by_safetyculture.app.mjs";

export default {
  key: "iauditor_by_safetyculture-create-user",
  name: "Create User",
  description: "Create a new user in iAuditor by SafetyCulture. [See the documentation](https://developer.safetyculture.com/reference/thepubservice_adduser)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    safetyculture,
    firstName: {
      propDefinition: [
        safetyculture,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        safetyculture,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        safetyculture,
        "email",
      ],
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the user",
    },
    resetPasswordRequired: {
      type: "boolean",
      label: "Reset Password Required",
      description: "Should the user receive an email to reset their password the first time they access SafetyCulture?",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message passed to the newly created user",
      optional: true,
    },
    seatType: {
      propDefinition: [
        safetyculture,
        "seatType",
      ],
    },
  },
  async run({ $ }) {
    const { user } = await this.safetyculture.createUser({
      data: {
        firstname: this.firstName,
        lastname: this.lastName,
        email: this.email,
        password: this.password,
        reset_password_required: this.resetPasswordRequired,
        message: this.message,
        seat_type: this.seatType,
      },
      $,
    });

    if (user?.user_id) {
      $.export("$summary", `Successfully created user with ID ${user.user_id}`);
    }

    return user;
  },
};

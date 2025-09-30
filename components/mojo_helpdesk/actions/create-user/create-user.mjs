import mojoHelpdesk from "../../mojo_helpdesk.app.mjs";

export default {
  key: "mojo_helpdesk-create-user",
  name: "Create User",
  description: "Create a new user. [See the docs here](https://github.com/mojohelpdesk/mojohelpdesk-api-doc#create-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mojoHelpdesk,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the new user",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the new user",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the new user",
      optional: true,
    },
    sendWelcomeEmail: {
      type: "boolean",
      label: "Send Welcome Email?",
      description: "Set to true to send a welcome email to the user's email address",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
      send_welcome_email: +this.sendWelcomeEmail,
    };

    const response = await this.mojoHelpdesk.createUser({
      data,
      $,
    });

    $.export("$summary", `Successfully created user with ID ${response.id}`);

    return response;
  },
};

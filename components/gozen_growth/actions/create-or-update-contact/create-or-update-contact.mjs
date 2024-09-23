import gozenGrowth from "../../gozen_growth.app.mjs";

export default {
  key: "gozen_growth-create-or-update-contact",
  name: "Create Or Update Contact",
  description: "Create or update a contact a on Gozen Growth. [See the documentation](https://docs.gozen.io/docs/automation/how-to-use-webhook-trigger)",
  version: "0.0.1",
  type: "action",
  props: {
    gozenGrowth,
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the contact. Must be a valid email address.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact. String without special characters.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact. String without special characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gozenGrowth.createOrUpdateContact({
      $,
      data: {
        contact: {
          email_address: this.emailAddress,
          first_name: this.firstName,
          last_name: this.lastName,
        },
      },
    });

    $.export("$summary", `Successfully created or updated contact with email: ${this.emailAddress}`);
    return response;
  },
};

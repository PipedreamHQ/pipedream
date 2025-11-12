import app from "../../airmeet.app.mjs";

export default {
  name: "Add Authorized Attendee",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "airmeet-add-authorized-attendee",
  description: "Add authorized Attendee. [See the documentation](https://help.airmeet.com/support/solutions/articles/82000467794-airmeet-public-apis-v2-0#5.1-Add-Authorized-Attendee)",
  type: "action",
  props: {
    app,
    airmeetId: {
      propDefinition: [
        app,
        "airmeetId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the atendee",
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "First name of the atendee",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "Last name of the atendee",
    },
  },
  async run({ $ }) {
    const response = await this.app.addAuthorizedAttendee({
      $,
      airmeetId: this.airmeetId,
      data: {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
      },
    });

    if (response) {
      $.export("$summary", `Successfully added authorized attendee with email \`${response.email}\``);
    }

    return response;
  },
};

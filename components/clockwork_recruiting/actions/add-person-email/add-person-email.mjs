import app from "../../clockwork_recruiting.app.mjs";

export default {
  key: "clockwork_recruiting-add-person-email",
  name: "Add Person Email",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create an email address to a specific person. [See the documentation](https://app.swaggerhub.com/apis-docs/clockwork-recruiting/cw-public-api/3.0.0#/Person%20Emails)",
  type: "action",
  props: {
    app,
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
    },
    address: {
      type: "string",
      label: "Email",
      description: "The email address.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The email's type.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      personId,
      ...data
    } = this;

    const response = await app.createEmail({
      $,
      personId,
      data: {
        email: data,
      },
    });

    $.export("$summary", `Successfully created new email with ID ${response.personEmailAddress?.id}`);
    return response;
  },
};

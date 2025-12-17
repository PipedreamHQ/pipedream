import app from "../../hunter.app.mjs";

export default {
  key: "hunter-update-lead",
  name: "Update Lead",
  description: "Update an existing lead in your Hunter account. [See the documentation](https://hunter.io/api-documentation/v2#update-lead).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    leadId: {
      propDefinition: [
        app,
        "leadId",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
      optional: true,
    },
    position: {
      propDefinition: [
        app,
        "position",
      ],
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
      optional: true,
    },
    website: {
      propDefinition: [
        app,
        "website",
      ],
    },
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      leadId,
      email,
      firstName,
      lastName,
      position,
      company,
      website,
      phoneNumber,
    } = this;

    await app.updateLead({
      $,
      leadId,
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        position,
        company,
        website,
        phone_number: phoneNumber,
      },
    });

    $.export("$summary", "Successfully updated lead");
    return {
      success: true,
    };
  },
};

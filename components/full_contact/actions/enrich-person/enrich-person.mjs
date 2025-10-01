import app from "../../full_contact.app.mjs";

export default {
  name: "Enrich Person",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "full_contact-enrich-person",
  description: "Enrich a person. [See documentation here](https://docs.fullcontact.com/docs/multi-field-request)",
  type: "action",
  props: {
    app,
    email: {
      label: "Email",
      description: "The email of the person to enrich",
      type: "string",
    },
    fullname: {
      label: "Fullname",
      description: "The fullname of the person to enrich",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.enrichPerson({
      $,
      data: {
        email: this.email,
        name: {
          full: this.fullname,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully enriched person with name ${response.fullName}`);
    }

    return response;
  },
};

import app from "../../clockwork_recruiting.app.mjs";

export default {
  key: "clockwork_recruiting-add-person-phone-number",
  name: "Add Phone Number",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a phone number to a specific person. [See the documentation](https://app.swaggerhub.com/apis-docs/clockwork-recruiting/cw-public-api/3.0.0#/Person%20Phone%20Numbers/post_people__person_id__phone_numbers)",
  type: "action",
  props: {
    app,
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
    },
    digits: {
      type: "string",
      label: "Digits",
      description: "The digits of the phone number.",
    },
    extension: {
      type: "string",
      label: "Extension",
      description: "The extension of the phone number.",
    },
    location: {
      type: "string",
      label: "Type",
      description: "The type of the phone number.",
    },
  },
  async run({ $ }) {
    const {
      app,
      personId,
      ...data
    } = this;

    const response = await app.createPhoneNumber({
      $,
      personId,
      data: {
        phone_number: data,
      },
    });

    $.export("$summary", `Successfully created new phone number with ID ${response.personPhoneNumber?.id}`);
    return response;
  },
};

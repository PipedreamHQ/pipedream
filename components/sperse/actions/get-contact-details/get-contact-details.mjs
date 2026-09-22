import app from "../../sperse.app.mjs";

export default {
  key: "sperse-get-contact-details",
  name: "Get Contact Details",
  description: "Retrieves detailed information about a contact. [See the documentation](https://app.sperse.com/app/api/swagger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      contactId,
    } = this;

    const response = await app.getContactDetails({
      $,
      params: {
        contactId,
      },
    });

    $.export("$summary", "Successfully retrieved contact details");

    return response;
  },
};

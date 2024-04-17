import { parseObjectEntries } from "../../common/utils.mjs";
import app from "../../highlevel_oauth.app.mjs";

export default {
  key: "highlevel_oauth-create-contact",
  name: "Create Contact",
  description: "Creates a new contact on HighLevel. [See the documentation](https://highlevel.stoplight.io/docs/integrations/4c8362223c17b-create-contact)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    name: {
      type: "string",
      label: "First Name",
      description: "Full name of the contact, e.g. `Rosan Deo`",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact, e.g. `rosan@deos.com`",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact, e.g. `+1 888-888-8888`",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Gender of the contact, e.g. `male`",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to send in the request. [See the documentation](https://highlevel.stoplight.io/docs/integrations/4c8362223c17b-create-contact) for available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, additionalOptions, ...data
    } = this;
    const response = await app.createContact({
      $,
      data: {
        ...data,
        ...(additionalOptions && parseObjectEntries(additionalOptions)),
      },
    });

    $.export("$summary", `Successfully created contact (ID: ${response?.contact?.id})`);
    return response;
  },
};

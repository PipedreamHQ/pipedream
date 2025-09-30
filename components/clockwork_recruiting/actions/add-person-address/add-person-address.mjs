import app from "../../clockwork_recruiting.app.mjs";

export default {
  key: "clockwork_recruiting-add-person-address",
  name: "Add Person Address",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create an address to a specific person. [See the documentation](https://app.swaggerhub.com/apis-docs/clockwork-recruiting/cw-public-api/3.0.0#/Person%20Addresses/post_people__person_id__addresses)",
  type: "action",
  props: {
    app,
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
    },
    city: {
      type: "string",
      label: "City",
      description: "The address' city.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The address' country.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The address' postal code.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The address' state.",
    },
    street: {
      type: "string",
      label: "Street",
      description: "The address' street.",
      optional: true,
    },
    street2: {
      type: "string",
      label: "Street 2",
      description: "The address' street 2.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The address' type.",
      optional: true,
    },
    regionId: {
      propDefinition: [
        app,
        "regionId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      personId,
      regionId,
      street2,
      ...data
    } = this;

    const response = await app.createAddress({
      $,
      personId,
      data: {
        address: {
          ...data,
          region_id: regionId,
          street_2: street2,
        },
      },
    });

    $.export("$summary", `Successfully created new address with ID ${response.personAddress?.id}`);
    return response;
  },
};

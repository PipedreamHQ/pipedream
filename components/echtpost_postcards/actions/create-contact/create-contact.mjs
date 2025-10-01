import echtpostPostcards from "../../echtpost_postcards.app.mjs";

export default {
  key: "echtpost_postcards-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within the EchtPost app. [See the documentation](https://hilfe.echtpost.de/article/20/postkartenversand-uber-api-programmierschnittstelle)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    echtpostPostcards,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new contact.",
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street address of the new contact.",
    },
    zip: {
      type: "string",
      label: "ZIP Code",
      description: "ZIP code of the new contact.",
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the new contact.",
    },
    first: {
      type: "string",
      label: "First Name",
      description: "The first name of the new contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      echtpostPostcards, ...data
    } = this;
    const response = await echtpostPostcards.createContact({
      $,
      data,
    });

    $.export("$summary", `Successfully created contact (ID: ${response.id})`);
    return response;
  },
};

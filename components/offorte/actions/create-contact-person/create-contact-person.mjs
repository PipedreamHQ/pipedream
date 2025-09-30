import { parseObject } from "../../common/utils.mjs";
import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-create-contact-person",
  name: "Create Contact Person",
  description: "Create a new contact person in Offorte. [See the documentation](https://www.offorte.com/api-docs/api#tag/Contacts/operation/createContactPerson)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    offorte,
    organisationId: {
      propDefinition: [
        offorte,
        "organisationId",
      ],
    },
    fullname: {
      propDefinition: [
        offorte,
        "name",
      ],
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    salutation: {
      type: "string",
      label: "Salutation",
      description: "The salutation of the contact",
      optional: true,
    },
    street: {
      propDefinition: [
        offorte,
        "street",
      ],
      optional: true,
    },
    zipcode: {
      propDefinition: [
        offorte,
        "zipcode",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        offorte,
        "city",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        offorte,
        "state",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        offorte,
        "country",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        offorte,
        "phone",
      ],
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The mobile number of the contact",
      optional: true,
    },
    email: {
      propDefinition: [
        offorte,
        "email",
      ],
      optional: true,
    },
    internet: {
      propDefinition: [
        offorte,
        "internet",
      ],
      optional: true,
    },
    linkedin: {
      propDefinition: [
        offorte,
        "linkedin",
      ],
      optional: true,
    },
    facebook: {
      propDefinition: [
        offorte,
        "facebook",
      ],
      optional: true,
    },
    twitter: {
      propDefinition: [
        offorte,
        "twitter",
      ],
      optional: true,
    },
    instagram: {
      propDefinition: [
        offorte,
        "instagram",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        offorte,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      offorte,
      organisationId,
      tags,
      ...data
    } = this;

    const response = await offorte.createContactPerson({
      $,
      organisationId,
      data: {
        ...data,
        tags: parseObject(tags),
      },
    });

    $.export("$summary", "Contact person created successfully");
    return response.data;
  },
};

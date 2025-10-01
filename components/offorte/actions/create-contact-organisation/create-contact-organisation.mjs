import { parseObject } from "../../common/utils.mjs";
import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-create-contact-organisation",
  name: "Create Contact Organisation",
  description: "Create a new contact organisation in Offorte. [See the documentation](https://www.offorte.com/api-docs/api#tag/Contacts/operation/createContactOrganisation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    offorte,
    name: {
      propDefinition: [
        offorte,
        "name",
      ],
    },
    street: {
      propDefinition: [
        offorte,
        "street",
      ],
    },
    zipcode: {
      propDefinition: [
        offorte,
        "zipcode",
      ],
    },
    city: {
      propDefinition: [
        offorte,
        "city",
      ],
    },
    state: {
      propDefinition: [
        offorte,
        "state",
      ],
    },
    country: {
      propDefinition: [
        offorte,
        "country",
      ],
    },
    phone: {
      propDefinition: [
        offorte,
        "phone",
      ],
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "The fax number of the contact",
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
    coc_number: {
      type: "string",
      label: "COC Number",
      description: "The COC number of the contact",
      optional: true,
    },
    vat_number: {
      type: "string",
      label: "VAT Number",
      description: "The VAT number of the contact",
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
    const response = await this.offorte.createContactOrganisation({
      $,
      data: {
        name: this.name,
        type: "organisation",
        street: this.street,
        zipcode: this.zipcode,
        city: this.city,
        state: this.state,
        country: this.country,
        phone: this.phone,
        fax: this.fax,
        email: this.email,
        internet: this.internet,
        linkedin: this.linkedin,
        facebook: this.facebook,
        twitter: this.twitter,
        instagram: this.instagram,
        coc_number: this.coc_number,
        vat_number: this.vat_number,
        tags: parseObject(this.tags),
      },
    });

    $.export("$summary", "Contact organisation created successfully");
    return response.data;
  },
};

import app from "../../quentn.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "quentn-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Creates or updates a contact. [See the docs](https://help.quentn.com/hc/en-150/articles/4517835330961-Contact-API).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      description: "The email address of the contact",
      propDefinition: [
        app,
        "email",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
    },
    jobTitle: {
      propDefinition: [
        app,
        "jobTitle",
      ],
    },
    phoneType: {
      propDefinition: [
        app,
        "phoneType",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    skype: {
      propDefinition: [
        app,
        "skype",
      ],
    },
    fb: {
      propDefinition: [
        app,
        "fb",
      ],
    },
    twitter: {
      propDefinition: [
        app,
        "twitter",
      ],
    },
    street: {
      propDefinition: [
        app,
        "street",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    postalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    dateOfBirth: {
      propDefinition: [
        app,
        "dateOfBirth",
      ],
    },
    terms: {
      type: "string[]",
      label: "Tags",
      description: "Tags",
      propDefinition: [
        app,
        "termId",
      ],
    },
  },
  async run({ $: step }) {
    const {
      email,
      title,
      firstName,
      lastName,
      company,
      jobTitle,
      phoneType,
      phone,
      skype,
      fb,
      twitter,
      street,
      city,
      postalCode,
      state,
      country,
      dateOfBirth,
      terms,
    } = this;

    const contact = await this.app.createContact({
      step,
      data: {
        return_fields: constants.FIELDS,
        duplicate_merge_method: "update",
        contact: {
          mail: email,
          title,
          first_name: firstName,
          family_name: lastName,
          company,
          job_title: jobTitle,
          phone_type: phoneType,
          phone,
          skype,
          fb,
          twitter,
          ba_street: street,
          ba_city: city,
          ba_postal_code: postalCode,
          ba_state: state,
          ba_country: country,
          date_of_birth: dateOfBirth,
          terms,
        },
      },
    });

    step.export("$summary", `Successfully created/updated contact with ID ${contact.id}`);

    return contact;
  },
};

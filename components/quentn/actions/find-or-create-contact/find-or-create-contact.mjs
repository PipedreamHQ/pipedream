import app from "../../quentn.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "quentn-find-or-create-contact",
  name: "Find or Create Contact",
  description: "Finds or creates a contact. [See the docs](https://help.quentn.com/hc/en-150/articles/4517835330961-Contact-API).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    email: {
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

    try {
      const [
        contact,
      ] = await this.app.listContactsByEmail({
        step,
        email: encodeURIComponent(email),
      });

      step.export("$summary", `Successfully found contact with ID ${contact.id}`);

      return contact;

    } catch (error) {
      if (error.response.status === 404) {
        const contact = await this.app.createContact({
          step,
          data: {
            return_fields: constants.FIELDS,
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

        step.export("$summary", `Successfully created contact with ID ${contact.id}`);

        return contact;
      }
      throw error;
    }
  },
};

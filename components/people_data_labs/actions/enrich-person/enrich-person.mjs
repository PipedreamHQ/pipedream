import app from "../../people_data_labs.app.mjs";

export default {
  key: "people_data_labs-enrich-person",
  name: "Enrich a person",
  description: "The Person Enrichment API provides a one-to-one match, retrieving up-to-date information on a unique individual. [See the docs here](https://docs.peopledatalabs.com/docs/reference-person-enrichment-api)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      label: "Name",
      type: "string",
      description: "The person's full name, at least first and last.",
      optional: true,
    },
    firstName: {
      label: "First name",
      type: "string",
      description: "The person's first name.",
      optional: true,
    },
    lastName: {
      label: "Last name",
      type: "string",
      description: "The person's last name.",
      optional: true,
    },
    middleName: {
      label: "Middle name",
      type: "string",
      description: "The person's middle name.",
      optional: true,
    },
    location: {
      label: "Location",
      type: "string",
      description: "The location in which a person lives. Can be anything from a street address to a country name.",
      optional: true,
    },
    streetAddress: {
      label: "Street address",
      type: "string",
      description: "A street address in which the person lives.",
      optional: true,
    },
    locality: {
      label: "Locality",
      type: "string",
      description: "A locality in which the person lives.",
      optional: true,
    },
    region: {
      label: "Region",
      type: "string",
      description: "A state or region in which the person lives.",
      optional: true,
    },
    country: {
      label: "Country",
      type: "string",
      description: "A country in which the person lives.",
      optional: true,
    },
    postalCode: {
      label: "Postal code",
      type: "string",
      description: "The postal code in which the person lives, must be used with either a country or a region.",
      optional: true,
    },
    company: {
      label: "Company",
      type: "string",
      description: "A name, website, or social url of a company where the person has worked.",
      optional: true,
    },
    school: {
      label: "School",
      type: "string",
      description: "A name, website, or social url of a university or college the person has attended.",
      optional: true,
    },
    phone: {
      label: "Phone",
      type: "string",
      description: "A phone number the person has used.",
      optional: true,
    },
    email: {
      label: "Email",
      type: "string",
      description: "An email the person has used.",
      optional: true,
    },
    emailHash: {
      label: "Email hash",
      type: "string",
      description: "A sha256 email hash.",
      optional: true,
    },
    profile: {
      label: "Profile",
      type: "string",
      description: "A social profile the person has used. [List of available social profiles](https://docs.peopledatalabs.com/docs/social-networks).",
      optional: true,
    },
    lid: {
      label: "Linkedin ID",
      type: "integer",
      description: "A LinkedIn numerical ID.",
      optional: true,
    },
    birthDate: {
      label: "Birth date",
      type: "string",
      description: "The person's birth date. Either the year, or a full birth date.",
      optional: true,
    },
    required: {
      label: "Required",
      type: "string",
      description: "Parameter specifying the fields and data points a response must have to return a 200. [See docs](https://docs.peopledatalabs.com/docs/required-parameter).",
      optional: true,
    },
    pretty: {
      propDefinition: [
        app,
        "pretty",
      ],
    },
    minLikelihood: {
      propDefinition: [
        app,
        "minLikelihood",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      name: this.name,
      first_name: this.firstName,
      last_name: this.lastName,
      middle_name: this.middleName,
      location: this.location,
      street_address: this.streetAddress,
      locality: this.locality,
      region: this.region,
      country: this.country,
      postal_code: this.postalCode,
      company: this.company,
      school: this.school,
      phone: this.phone,
      email: this.email,
      email_hash: this.emailHash,
      profile: this.profile,
      lid: this.lid,
      birth_date: this.birthDate,
      min_likelihood: this.minLikelihood || 0,
      required: this.required,
      pretty: this.pretty || true,
    };

    const res = await this.app.enrichPerson({
      $,
      params,
    });
    if (!res) {
      $.export("$summary", "No results found");
    } else {
      $.export("$summary", "Successfully enriched a person");
    }
    return res;
  },
};

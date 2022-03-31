// legacy_hash_id: a_bKiP4e
import { axios } from "@pipedream/platform";

export default {
  key: "people_data_labs-enrich",
  name: "Enrich a person",
  description: "Full enrichment API.  See docs for minimum combination of data points a request must contain for a 200 response.",
  version: "0.8.2",
  type: "action",
  props: {
    people_data_labs: {
      type: "app",
      app: "people_data_labs",
    },
    name: {
      type: "string",
      description: "The person's full name, at least first and last.",
      optional: true,
    },
    first_name: {
      type: "string",
      description: "The person's first name.",
      optional: true,
    },
    last_name: {
      type: "string",
      description: "The person's last name.",
      optional: true,
    },
    middle_name: {
      type: "string",
      description: "The person's middle name.",
      optional: true,
    },
    location: {
      type: "string",
      description: "The location in which a person lives. Can be anything from a street address to a country name.",
      optional: true,
    },
    street_address: {
      type: "string",
      description: "A street address in which the person lives.",
      optional: true,
    },
    locality: {
      type: "string",
      description: "A locality in which the person lives.",
      optional: true,
    },
    region: {
      type: "string",
      description: "A state or region in which the person lives.",
      optional: true,
    },
    country: {
      type: "string",
      description: "A country in which the person lives.",
      optional: true,
    },
    postal_code: {
      type: "string",
      description: "The postal code in which the person lives, must be used with either a country or a region.",
      optional: true,
    },
    company: {
      type: "string",
      description: "A name, website, or social url of a company where the person has worked.",
      optional: true,
    },
    school: {
      type: "string",
      description: "A name, website, or social url of a university or college the person has attended.",
      optional: true,
    },
    phone: {
      type: "string",
      description: "A phone number the person has used.",
      optional: true,
    },
    email: {
      type: "string",
      description: "An email the person has used.",
      optional: true,
    },
    email_hash: {
      type: "string",
      description: "A sha256 email hash.",
      optional: true,
    },
    profile: {
      type: "string",
      description: "A social profile the person has used. [List of available social profiles](https://docs.peopledatalabs.com/docs/social-networks).",
      optional: true,
    },
    lid: {
      type: "integer",
      description: "A LinkedIn numerical ID.",
      optional: true,
    },
    birth_date: {
      type: "string",
      description: "The person's birth date. Either the year, or a full birth date.",
      optional: true,
    },
    min_likelihood: {
      type: "string",
      description: "The minimum likelihood score a response must have to return a 200.",
      optional: true,
    },
    required: {
      type: "string",
      description: "Parameter specifying the fields and data points a response must have to return a 200.  See [docs](https://docs.peopledatalabs.com/docs/required-parameter).",
      optional: true,
    },
    pretty: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.peopledatalabs.com/v5/person",
      params: {
        api_key: this.people_data_labs.$auth.api_key,
        name: this.name,
        first_name: this.first_name,
        last_name: this.last_name,
        middle_name: this.middle_name,
        location: this.location,
        street_address: this.street_address,
        locality: this.locality,
        region: this.region,
        country: this.country,
        postal_code: this.postal_code,
        company: this.company,
        school: this.school,
        phone: this.phone,
        email: this.email,
        email_hash: this.email_hash,
        profile: this.profile,
        lid: this.lid,
        birth_date: this.birth_date,
        min_likelihood: this.min_likelihood || 0,
        required: this.required,
        pretty: this.pretty || true,
      },
    });
  },
};

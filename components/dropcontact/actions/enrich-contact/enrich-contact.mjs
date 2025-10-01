import dropcontact from "../../dropcontact.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dropcontact-enrich-contact",
  name: "Enrich Contact",
  description: "Enrich a list of contacts in Dropcontact. [See the documentation](https://developer.dropcontact.com/#post-request)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dropcontact,
    email: {
      type: "string",
      label: "Email",
      description: "The email that you want to verify",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Full name of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company's name",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website URL of a company",
      optional: true,
    },
    numSiren: {
      type: "string",
      label: "Siren Number",
      description: "Company's siren",
      optional: true,
    },
    siren: {
      type: "boolean",
      label: "Siren",
      description: "True if you want the SIREN number, NAF code, TVA number, company address and informations about the company leader.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "`en` if you want result in English, if this not specified the results will be in French.",
      options: [
        "en",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      dropcontact,
      email,
      firstName,
      lastName,
      fullName,
      phone,
      company,
      website,
      numSiren,
      siren,
      language,
    } = this;

    if (!email
      && !firstName
      && !lastName
      && !fullName
      && !phone
      && !company
      && !website
      && !numSiren) {
      throw new ConfigurationError("Must specify at least one of `email`, `firstName`, `lastName`, `fullName`, `phone`, `company`, `website`, `numSiren`.");
    }

    const response = await dropcontact.enrichContact({
      data: {
        data: [
          {
            email,
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
            phone,
            company,
            website,
            num_siren: numSiren,
          },
        ],
        siren,
        language,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully enriched contacts.");
    }

    return response;
  },
};

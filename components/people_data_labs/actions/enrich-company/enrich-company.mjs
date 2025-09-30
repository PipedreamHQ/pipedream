import app from "../../people_data_labs.app.mjs";

export default {
  key: "people_data_labs-enrich-company",
  name: "Enrich a company",
  description: "The Company Enrichment API provides a one-to-one match, retrieving up-to-date information on a unique company. [See the docs here](https://docs.peopledatalabs.com/docs/reference-company-enrichment-api)",
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
      description: "The company's name.",
      optional: true,
    },
    profile: {
      label: "Profile",
      type: "string",
      description: "The company's social profile.",
      optional: true,
    },
    ticker: {
      label: "Ticker",
      type: "string",
      description: "The company's stock ticker, if publicly traded.",
      optional: true,
    },
    website: {
      label: "Website",
      type: "string",
      description: "The company's website.",
      optional: true,
    },
    location: {
      label: "Location",
      type: "string",
      description: "The complete or partial company location. You can input multiple location values.",
      optional: true,
    },
    locality: {
      label: "Locality",
      type: "string",
      description: "The company's locality. You can only input one locality.",
      optional: true,
    },
    region: {
      label: "Region",
      type: "string",
      description: "The company's region. You can only input one region.",
      optional: true,
    },
    country: {
      label: "Country",
      type: "string",
      description: "The company's country. You can only input one country.",
      optional: true,
    },
    streetAddress: {
      label: "Street Address",
      type: "string",
      description: "The company's street address. You can only input one street address.",
      optional: true,
    },
    postalCode: {
      label: "Postal Code",
      type: "string",
      description: "The company's postal code. You can only input one postal code.",
      optional: true,
    },
    dataInclude: {
      label: "Data Include",
      type: "string",
      description: "A comma-separated string of fields that you want the response to include. For example, `full_name,emails.address`. Begin the string with a - if you want to exclude the specified fields. If you want to exclude all data from being returned, use `data_include=\"\"`",
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
  async run ({ $ }) {
    const params = {
      name: this.name,
      profile: this.profile,
      ticker: this.ticker,
      website: this.website,
      location: this.location,
      locality: this.locality,
      region: this.region,
      country: this.country,
      street_address: this.streetAddress,
      postal_code: this.postalCode,
      data_include: this.dataInclude,
      pretty: this.pretty,
      min_likelihood: this.minLikelihood,
    };

    const res = await this.app.enrichCompany({
      $,
      params,
    });
    if (!res) {
      $.export("$summary", "No results found");
    } else {
      $.export("$summary", "Successfully enriched a company");
    }
    return res;
  },
};

import woodpecker from "../../woodpecker_co.app.mjs";

export default {
  key: "woodpecker_co-find-prospect-email",
  name: "Find Prospect's email",
  description: "This action searches a specific prospect. [See the docs here](https://woodpecker.co/help/api-managing-prospects/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    woodpecker,
    firstName: {
      propDefinition: [
        woodpecker,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        woodpecker,
        "lastName",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        woodpecker,
        "company",
      ],
      optional: true,
    },
    industry: {
      propDefinition: [
        woodpecker,
        "industry",
      ],
      optional: true,
    },
    website: {
      propDefinition: [
        woodpecker,
        "website",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        woodpecker,
        "tags",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        woodpecker,
        "title",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        woodpecker,
        "phone",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        woodpecker,
        "address",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        woodpecker,
        "city",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        woodpecker,
        "state",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        woodpecker,
        "country",
      ],
      optional: true,
    },
    sort: {
      propDefinition: [
        woodpecker,
        "sort",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      firstName,
      lastName,
      company,
      industry,
      website,
      tags,
      title,
      phone,
      address,
      city,
      state,
      country,
      sort,
    } = this;

    const response = await this.woodpecker.listProspects({
      firstName,
      lastName,
      company,
      industry,
      website,
      tags,
      title,
      phone,
      address,
      city,
      state,
      country,
      sort: sort?.toString(),
    });

    const suffix = response.length > 1
      ? "s"
      : "";
    $.export("$summary", `Successfully fetched ${response.length} prospect${suffix}!`);
    return response;
  },
};


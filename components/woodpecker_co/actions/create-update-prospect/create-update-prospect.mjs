import woodpecker from "../../woodpecker_co.app.mjs";

export default {
  key: "woodpecker_co-create-update-prospect",
  name: "Create Or Update Prospect",
  description: "This action creates/updates a prospect. [See the docs here](https://woodpecker.co/help/api-managing-prospects/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    woodpecker,
    id: {
      propDefinition: [
        woodpecker,
        "campaignProspectId",
      ],
      optional: true,
    },
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
    email: {
      propDefinition: [
        woodpecker,
        "email",
      ],
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
    snippet: {
      propDefinition: [
        woodpecker,
        "snippet",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      id,
      firstName,
      lastName,
      email,
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
      snippet,
    } = this;

    const response = await this.woodpecker.createOrUpdateProspect({
      $,
      params: {
        id,
        firstName,
        lastName,
        email,
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
        ...snippet,
      },
    });

    const action = id
      ? "updated"
      : "created";

    $.export("$summary", `Prospect successfully ${action}!`);
    return response;
  },
};


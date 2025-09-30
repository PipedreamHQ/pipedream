import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-create-company",
  name: "Create Company",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new company. [See the docs here](https://developers.teamgate.com/#2b3a0450-e365-4f89-b02c-e817d997f627)",
  type: "action",
  props: {
    teamgate,
    name: {
      propDefinition: [
        teamgate,
        "name",
      ],
    },
    personId: {
      propDefinition: [
        teamgate,
        "personId",
      ],
      optional: true,
    },
    jobTitle: {
      propDefinition: [
        teamgate,
        "jobTitle",
      ],
      optional: true,
    },
    customerStatusId: {
      propDefinition: [
        teamgate,
        "customerStatusId",
      ],
      optional: true,
    },
    prospectStatusId: {
      propDefinition: [
        teamgate,
        "prospectStatusId",
      ],
      optional: true,
    },
    starred: {
      propDefinition: [
        teamgate,
        "starred",
      ],
      optional: true,
    },
    ownerId: {
      propDefinition: [
        teamgate,
        "ownerId",
      ],
      optional: true,
    },
    ownerUsername: {
      propDefinition: [
        teamgate,
        "ownerUsername",
      ],
      optional: true,
    },
    ownerRandom: {
      propDefinition: [
        teamgate,
        "ownerRandom",
      ],
      optional: true,
    },
    sourceId: {
      propDefinition: [
        teamgate,
        "sourceId",
      ],
      optional: true,
    },
    source: {
      propDefinition: [
        teamgate,
        "source",
      ],
      optional: true,
    },
    sourceDescription: {
      propDefinition: [
        teamgate,
        "sourceDescription",
      ],
      optional: true,
    },
    industryId: {
      propDefinition: [
        teamgate,
        "industryId",
      ],
      optional: true,
    },
    industry: {
      propDefinition: [
        teamgate,
        "industry",
      ],
      optional: true,
    },
    industryDescription: {
      propDefinition: [
        teamgate,
        "industryDescription",
      ],
      optional: true,
    },
    code: {
      type: "string",
      label: "Code",
      description: "Unique code of the Company.",
      optional: true,
    },
    vatCode: {
      type: "string",
      label: "VAT Code",
      description: "VAT identification number of the Company.",
      optional: true,
    },
    tags: {
      propDefinition: [
        teamgate,
        "tags",
      ],
      optional: true,
    },
    emails: {
      propDefinition: [
        teamgate,
        "emails",
      ],
      optional: true,
    },
    phones: {
      propDefinition: [
        teamgate,
        "phones",
      ],
      optional: true,
    },
    urls: {
      propDefinition: [
        teamgate,
        "urls",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        teamgate,
        "address",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        teamgate,
        "customFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      personId,
      jobTitle,
      customerStatusId,
      prospectStatusId,
      starred,
      ownerId,
      ownerUsername,
      ownerRandom,
      sourceId,
      source,
      sourceDescription,
      industryId,
      industry,
      industryDescription,
      code,
      vatCode,
      tags,
      emails,
      phones,
      urls,
      address,
      customFields,
    } = this;

    const data = {
      name,
      personId,
      jobTitle,
      customerStatusId,
      prospectStatusId,
      starred,
      ownerId,
      ownerUsername,
      ownerRandom,
      sourceId,
      source,
      sourceDescription,
      industryId,
      industry,
      industryDescription,
      code,
      vatCode,
      tags,
      emails: emails && emails.map((item) => (JSON.parse(item))),
      phones: phones && phones.map((item) => (JSON.parse(item))),
      urls: urls && urls.map((item) => (JSON.parse(item))),
      addresses: address && address.map((item) => (JSON.parse(item))),
      customFields,
    };

    const response = await this.teamgate.createCompany({
      $,
      data,
    });

    $.export("$summary", "Company Successfully created!");
    return response;
  },
};

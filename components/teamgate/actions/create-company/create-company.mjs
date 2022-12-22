import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-create-company",
  name: "Create Company",
  version: "0.0.1",
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
      type: "string",
      label: "Industry",
      description: "If the industry does not exist it will be created.",
      optional: true,
    },
    industryDescription: {
      type: "string",
      label: "Industry Description",
      description: "Will be set only if will be created new industry.",
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
      type: "string[]",
      label: "Emails",
      description: "A list of the company's emails. Example for string value: `{\"value\":\"john@example.net\",\"type\":\"work\"}` [Object format](https://developers.teamgate.com/#c3d764d8-af9b-46e6-be97-cc8d0264a376)",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "A list of the company's phones. Example for string value: `{\"value\":\"+44 123 456 7890\",\"type\":\"mobile\"}` [Object format](https://developers.teamgate.com/#6a9c4d1a-c72a-4409-8041-afe30c64314c)",
      optional: true,
    },
    urls: {
      type: "string[]",
      label: "URLS",
      description: "A list of the company's urls. Example for string value: `{\"value\":\"https://facebook.com/example\",\"type\":\"facebook\"}` [Object format](https://developers.teamgate.com/#c4d7bd78-8b18-4b2e-9505-82f66f786455)",
      optional: true,
    },
    address: {
      type: "string[]",
      label: "Address",
      description: "A list of address objects. Example for string value: `{\"value\":{\"city\":\"Chicago\",\"countryIso\":\"USA\"}}` [Object format](https://developers.teamgate.com/#f1511aad-d3dc-4118-98d6-bed247321ea3)",
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
      emails: emails.map((item) => (JSON.parse(item))),
      phones: phones.map((item) => (JSON.parse(item))),
      urls: urls.map((item) => (JSON.parse(item))),
      addresses: address.map((item) => (JSON.parse(item))),
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

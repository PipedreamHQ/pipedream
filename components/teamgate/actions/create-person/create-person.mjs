import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-create-person",
  name: "Create Person",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new person. [See the docs here](https://developers.teamgate.com/#6a612101-c0cb-404c-9442-29d07c352185)",
  type: "action",
  props: {
    teamgate,
    name: {
      propDefinition: [
        teamgate,
        "name",
      ],
      description: "The person's name.",
    },
    companies: {
      propDefinition: [
        teamgate,
        "companies",
      ],
      optional: true,
    },
    jobTitle: {
      propDefinition: [
        teamgate,
        "jobTitle",
      ],
      description: "The field will be set only if `companyId` is not empty.",
      optional: true,
    },
    customerStatusId: {
      propDefinition: [
        teamgate,
        "customerStatusId",
      ],
      description: "The person`s customer status.",
      optional: true,
    },
    prospectStatusId: {
      propDefinition: [
        teamgate,
        "prospectStatusId",
      ],
      optional: true,
      description: "The person`s prospect status.",
    },
    starred: {
      propDefinition: [
        teamgate,
        "starred",
      ],
      description: "Indicator the person is starred or not.",
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
      description: "The username to which the person belongs.",
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
    birthday: {
      type: "string",
      label: "Birthday",
      description: "Person's date of birth in YYY-MM-DD format.",
      optional: true,
    },
    personalNumber: {
      type: "string",
      label: "Personal Number",
      description: "Unique personal identification code.",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The person's gender.",
      optional: true,
      options: [
        "male",
        "female",
      ],
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
      companies,
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
      tags,
      emails,
      phones,
      urls,
      address,
      birthday,
      personalNumber,
      gender,
      customFields,
    } = this;

    const data = {
      name,
      companyId: companies,
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
      tags,
      emails: emails && emails.map((item) => (JSON.parse(item))),
      phones: phones && phones.map((item) => (JSON.parse(item))),
      urls: urls && urls.map((item) => (JSON.parse(item))),
      address: address && address.map((item) => (JSON.parse(item))),
      birthday,
      personalNumber,
      gender,
      customFields,
    };

    const response = await this.teamgate.createPerson({
      $,
      data,
    });

    $.export("$summary", "Person Successfully created!");
    return response;
  },
};

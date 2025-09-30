import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-create-lead",
  name: "Create Lead",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new lead. [See the docs here](https://developers.teamgate.com/#8921df2b-3158-4b16-b81c-c37c6414c20f)",
  type: "action",
  props: {
    teamgate,
    name: {
      propDefinition: [
        teamgate,
        "name",
      ],
      description: "Required only if a lead is an person and `companyName` and `companyId` is empty.",
      optional: true,
    },
    companyName: {
      propDefinition: [
        teamgate,
        "companyName",
      ],
      optional: true,
    },
    companies: {
      propDefinition: [
        teamgate,
        "companies",
      ],
      description: "Required only if a lead is an company and `name` is empty. The field will be set only if `companyName` is empty.",
      optional: true,
    },
    jobTitle: {
      propDefinition: [
        teamgate,
        "jobTitle",
      ],
      description: "The field will be set only if is set `companyName` or `companyId`.",
      optional: true,
    },
    statusId: {
      propDefinition: [
        teamgate,
        "leadStatusId",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        teamgate,
        "leadStatus",
      ],
      optional: true,
    },
    statusDescription: {
      propDefinition: [
        teamgate,
        "leadStatusDescription",
      ],
      optional: true,
    },
    starred: {
      propDefinition: [
        teamgate,
        "starred",
      ],
      description: "Indicator the lead is starred or not.",
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
      description: "The username to which the lead belongs.",
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
      companyName,
      companies,
      jobTitle,
      statusId,
      status,
      statusDescription,
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
      customFields,
    } = this;

    const data = {
      name,
      companyName,
      companyId: companies,
      jobTitle,
      statusId,
      status,
      statusDescription,
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
      customFields,
    };

    const response = await this.teamgate.createLead({
      $,
      data,
    });

    $.export("$summary", "Lead Successfully created!");
    return response;
  },
};
